import React, { useState, useRef, useEffect, useCallback } from "react";
import Layout from "./Layout";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import PopupHapus from "../components/PopupHapus";

const UjianSharaf = () => {
  const [token, setToken] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [indexDelete, setIndexDelete] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [phase, setPhase] = useState(1);
  const [kategoriMateri, setKategoriMateri] = useState("");
  const textAreaPembahasan = useRef([]);
  const textAreaPertanyaan = useRef([]);
  const textAreaJawaban = useRef([]);

  useEffect(() => {
    const accessToken = Cookies.get("user");
    if (accessToken) {
      setToken(accessToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchQuizData = useCallback(() => {
    axios
      .get(`https://enormous-mint-tomcat.ngrok-free.app/admin/ujian/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setQuizData(response.data.data);
        setPhase(response.data.data[0].phase);
        setKategoriMateri(response.data.data[0].kategori_materi);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, [id, token]);

  useEffect(() => {
    if (token) {
      fetchQuizData();
    }
  }, [id, token, fetchQuizData]);

  useEffect(() => {
    const adjustTextAreaHeights = () => {
      textAreaPembahasan.current.forEach((ref) => {
        if (ref) {
          ref.style.height = "auto";
          ref.style.height = ref.scrollHeight + "px";
        }
      });
      textAreaPertanyaan.current.forEach((ref) => {
        if (ref) {
          ref.style.height = "auto";
          ref.style.height = ref.scrollHeight + "px";
        }
      });
      textAreaJawaban.current.forEach((ref) => {
        if (ref) {
          ref.style.height = "auto";
          ref.style.height = ref.scrollHeight + "px";
        }
      });
    };

    adjustTextAreaHeights();
  }, [quizData]);

  const handlePertanyaanChange = (index, value) => {
    const newQuizData = [...quizData];
    newQuizData[index].soal = value;
    setQuizData(newQuizData);
  };

  const handlePembahasanChange = (index, value) => {
    const newQuizData = [...quizData];
    newQuizData[index].pembahasan = value;
    setQuizData(newQuizData);
  };

  const handlePilihanChange = (quizIndex, pilihanIndex, value) => {
    const newQuizData = [...quizData];
    newQuizData[quizIndex].pilihan[pilihanIndex].jawaban = value;
    setQuizData(newQuizData);
  };

  const handleJawabanBenarChange = (quizIndex, pilihanId) => {
    const newQuizData = [...quizData];
    newQuizData[quizIndex].jawaban_benar = pilihanId;
    setQuizData(newQuizData);
  };

  const toggleEditMode = (index) => {
    if (isAdding) {
      // Handle adding a new question
      handleSaveChanges(index); // Call save changes to post the new question
    } else {
      setEditMode((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    }
  };

  const handleDelete = (index) => {
    const soal_id = quizData[index].soal_id;
    const newQuizData = quizData.filter((_, i) => i !== index);

    if (isAdding) {
      setQuizData(newQuizData);

      setEditMode((prevState) => {
        const newEditMode = {};
        Object.keys(prevState).forEach((key) => {
          const newKey = parseInt(key);
          if (newKey < index) {
            newEditMode[newKey] = prevState[key];
          } else if (newKey > index) {
            newEditMode[newKey - 1] = prevState[key];
          }
        });
        return newEditMode;
      });

      setIsAdding(newQuizData.length < quizData.length);
      setShowPopup(false);
      return;
    } else {
      axios
        .delete(
          `https://enormous-mint-tomcat.ngrok-free.app/admin/soal/${soal_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setQuizData(newQuizData);
            setEditMode((prevState) => {
              const newEditMode = {};
              Object.keys(prevState).forEach((key) => {
                const newKey = parseInt(key);
                if (newKey < index) {
                  newEditMode[newKey] = prevState[key];
                } else if (newKey > index) {
                  newEditMode[newKey - 1] = prevState[key];
                }
              });
              return newEditMode;
            });
            setShowPopup(false);
          }
        })
        .catch((error) => {
          console.error("Error deleting question:", error);
        });
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      soal_id: Date.now(),
      soal: "",
      pembahasan: "",
      pilihan: [
        { id: 1, jawaban: "" },
        { id: 2, jawaban: "" },
        { id: 3, jawaban: "" },
        { id: 4, jawaban: "" },
      ],
      jawaban_benar: null,
    };
    setQuizData((prevState) => [newQuestion, ...prevState]);
    setEditMode((prevState) => {
      const newEditMode = {};
      Object.keys(prevState).forEach((key) => {
        newEditMode[parseInt(key) + 1] = prevState[key];
      });
      return { 0: true, ...newEditMode };
    });
    // setEditMode((prevState) =>
    //   Object.keys(prevState).reduce(
    //     (acc, key) => {
    //       acc[parseInt(key) + 1] = prevState[key];
    //       return acc;
    //     },
    //     { 0: true }
    //   )
    // );
    setIsAdding(true); // Set add mode
  };

  const handleSaveChanges = (index) => {
    if (isAdding) {
      // Add a new question
      // console.log("tambah soal");
      axios
        .post(
          `https://enormous-mint-tomcat.ngrok-free.app/admin/ujian/soal/${id}`,
          {
            soal: quizData[index].soal,
            pilihan: quizData[index].pilihan.map((item) => item.jawaban),
            jawaban_benar: quizData[index].jawaban_benar - 1,
            pembahasan: quizData[index].pembahasan,
            phase: phase,
            kategori_materi: kategoriMateri,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          if (response.status === 201) {
            setEditMode((prevState) => ({
              ...prevState,
              [index]: false, // Exit edit mode for the last question
            }));
            setIsAdding(false); // Exit add mode
            // fetchQuizData(); // Fetch latest quiz data after adding new question
            window.location.reload();
          }
        })
        .catch((error) => console.error("Error adding new question:", error));
    }
  };

  const handleSaveQuestion = (index) => {
    const question = quizData[index];

    axios
      .patch(
        `https://enormous-mint-tomcat.ngrok-free.app/admin/soal/${question.soal_id}`,
        {
          soal: question.soal,
          pilihan: question.pilihan.map((item) => ({
            id: item.id,
            jawaban: item.jawaban,
          })),
          jawaban_benar: question.jawaban_benar,
          pembahasan: question.pembahasan,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          setEditMode((prevState) => ({
            ...prevState,
            [index]: false, // Exit edit mode for the question
          }));
          fetchQuizData(); // Fetch latest quiz data after saving the question
        }
      })
      .catch((error) => console.error("Error saving question:", error));
  };

  return (
    <Layout>
      <div className="h-full min-h-screen mt-0 pt-2">
        <div className="bg-white rounded-l-3xl min-h-[98.75vh] h-full pt-5 pl-4 pr-4">
          <div className="border rounded-xl flex flex-col p-2 mb-4 ml-2">
            <div className="flex items-center">
              <NavLink to={`/sharaf/${kategoriMateri}`}>
                <ArrowBackIcon className="text-dark-cyan" />
              </NavLink>
              <p className="text-dark-cyan text-2xl font-semibold ml-2">Ujian</p>
            </div>
            <p className="text-sm">Anda dapat melakukan pengelolaan ujian</p>
            <div className="flex items-center">
              <a href={`/sharaf/${kategoriMateri}`} className="text-[#6D6D6D] text-sm">
                Sharaf
              </a>
              <PlayArrowIcon
                style={{ fontSize: "16px" }}
                className="text-[#6D6D6D]"
              />
              <a
                href={`/ujiansharaf/${id}`}
                className="text-dark-cyan text-sm font-medium"
              >
                Ujian
              </a>
            </div>
          </div>
          <div>
            <button
              className="bg-dark-cyan p-3 text-sm text-white rounded-lg font-medium ml-2 mb-2"
              onClick={handleAddQuestion}
            >
              Tambah Pertanyaan <AddIcon />
            </button>
            {quizData.length > 0 ? (
              <div className="flex flex-wrap justify-between ml-2 mr-2">
                {quizData.map((quiz, index) => (
                  <div
                    key={quiz.soal_id}
                    className="flex flex-col p-4 rounded-xl mb-4 w-[47.5%]"
                    style={{ boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
                  >
                    <div className="flex justify-between">
                      <p className="text-dark-cyan text-2xl font-semibold mb-5">
                        Pertanyaan {index + 1}
                      </p>
                      <div>
                        <button
                          className={`text-[#E57D1A] border border-[#E57D1A] rounded-2xl p-1 pl-2 pr-2 text-xs ${
                            editMode[index]
                              ? "bg-dark-cyan text-white border-dark-cyan"
                              : ""
                          }`}
                          onClick={() => {
                            if (!isAdding && editMode[index]) {
                              handleSaveQuestion(index);
                            } else {
                              toggleEditMode(index);
                            }
                          }}
                        >
                          {isAdding && index === quizData.length - 1
                            ? "Tambah"
                            : editMode[index]
                            ? "Simpan"
                            : "Edit"}{" "}
                          <SaveIcon />
                        </button>
                        <button
                          className="text-[#B3261E] border border-[#B3261E] rounded-2xl p-1 pl-2 pr-2 ml-2 text-xs"
                          onClick={() => {
                            setIndexDelete(index);
                            setShowPopup(true);
                          }}
                        >
                          Hapus <DeleteIcon />
                        </button>
                      </div>
                    </div>
                    <div className="flex w-[100%]">
                      <div className="w-[80%] flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor={`pertanyaan-${index}`}
                        >
                          Pertanyaan
                          <span className="text-red-600 font-medium">*</span>
                        </label>
                        <textarea
                          ref={(el) => (textAreaPertanyaan.current[index] = el)}
                          value={quiz.soal}
                          onChange={(e) =>
                            handlePertanyaanChange(index, e.target.value)
                          }
                          name={`pertanyaan-${index}`}
                          id={`pertanyaan-${index}`}
                          className="border border-[#919191] p-1 pl-3 w-full h-20 rounded-xl overflow-hidden resize-none"
                          required
                          readOnly={!editMode[index]}
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex flex-col w-[100%] justify-around ml-2 pr-2">
                      <div className="w-[100%] flex justify-between">
                        <label
                          className="font-medium text-sm"
                          htmlFor={`jawaban-${index}`}
                        >
                          Jawaban
                          <span className="text-red-600 font-medium">*</span>
                        </label>
                        <label
                          className="font-medium text-xs text-dark-cyan"
                          htmlFor={`poinJawaban-${index}`}
                        >
                          Tandai Jawaban Benar
                          <span className="text-red-600 font-medium">*</span>
                        </label>
                      </div>
                      {quiz.pilihan.map((pilihan, idx) => (
                        <div
                          key={pilihan.id}
                          className="w-[100%] flex justify-between items-center mt-2"
                        >
                          <div className="flex w-[80%] justify-between border border-[#919191] pl-2 rounded-xl">
                            <div className="p-[4px] pl-[10px] pr-[10px] mr-1 bg-dark-cyan w-fit text-white rounded-full h-fit mt-3">
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <textarea
                              ref={(el) => (textAreaJawaban.current[idx] = el)}
                              className="w-[100%] h-14 p-1 rounded-xl resize-none overflow-hidden"
                              placeholder={`Jawaban ${String.fromCharCode(
                                65 + idx
                              )}`}
                              value={pilihan.jawaban}
                              onChange={(e) =>
                                handlePilihanChange(index, idx, e.target.value)
                              }
                              readOnly={!editMode[index]}
                              required
                            />
                          </div>
                          <input
                            type="radio"
                            className="w-5 h-5 mr-5"
                            name={`poinJawaban-${index}`}
                            id={`poinJawaban-${idx}`}
                            checked={quiz.jawaban_benar === pilihan.id}
                            onChange={() =>
                              handleJawabanBenarChange(index, pilihan.id)
                            }
                            disabled={!editMode[index]}
                            required
                          />
                        </div>
                      ))}
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor={`pembahasan-${index}`}
                        >
                          Pembahasan
                          <span className="text-red-600 font-medium">*</span>
                        </label>
                        <textarea
                          ref={(el) => (textAreaPembahasan.current[index] = el)}
                          value={quiz.pembahasan}
                          onChange={(e) =>
                            handlePembahasanChange(index, e.target.value)
                          }
                          name={`pembahasan-${index}`}
                          id={`pembahasan-${index}`}
                          className="border border-[#919191] p-1 pl-3 w-full h-56 rounded-xl overflow-hidden resize-none"
                          required
                          readOnly={!editMode[index]}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-4">
                Tidak ada data ujian yang tersedia.
              </p>
            )}
          </div>
          <div>
            <NavLink to={`/sharaf/${kategoriMateri}`}>
              <button className="bg-dark-cyan mt-2 p-3 text-sm text-white rounded-lg font-medium ml-2 mb-6">
                &nbsp; Kembali <ArrowForwardIcon />
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      <PopupHapus show={showPopup} onClose={() => setShowPopup(false)}>
        <div className="mt-2">
          <p className="text-base font-semibold">
            Apakah anda ingin menghapus soal kuis?
          </p>
          <p className="text-base text-[#606060] mt-2">
            Jika anda tidak menghapus, hapuslah diri anda.
          </p>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className="bg-dark-cyan p-3 text-sm text-white rounded-lg font-medium ml-2 mb-2"
            onClick={() => setShowPopup(false)}
          >
            Tidak
          </button>
          <button
            className="bg-[#B3261E] p-3 text-sm text-white rounded-lg font-medium ml-2 mb-2"
            onClick={() => handleDelete(indexDelete)}
          >
            Ya
          </button>
        </div>
      </PopupHapus>
    </Layout>
  );
};

export default UjianSharaf;
