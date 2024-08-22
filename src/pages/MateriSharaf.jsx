import React, { useState, useRef, useEffect } from "react";
import Layout from "./Layout";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import PopupSuccess from "../components/PopupSuccess";

const MateriSharaf = () => {
  const [kategoriMateri, setKategoriMateri] = useState("");
  const [isiMateri, setIsiMateri] = useState("");
  const [judulMateri, setJudulMateri] = useState("");
  const [videoMateri, setVideoMateri] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const textAreaRef = useRef(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const accessToken = Cookies.get("user");
    if (accessToken) {
      setToken(accessToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      // Fetch specific Materi data
      axios
        .get(`https://enormous-mint-tomcat.ngrok-free.app/materi/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        })
        .then((response) => {
          const materi = response.data.data[0];
          setKategoriMateri(materi.kategori);
          setJudulMateri(materi.judul);
          setIsiMateri(materi.isi);
          setVideoMateri(materi.linkvideo);
        })
        .catch((error) => {
          console.error("Error fetching materi data:", error);
        });
    }
  }, [id, token]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [isiMateri]);

  const handleIsiMateriChange = (e) => {
    setIsiMateri(e.target.value);
  };

  const handleJudulMateriChange = (e) => {
    setJudulMateri(e.target.value);
  };

  const handleVideoMateriChange = (e) => {
    setVideoMateri(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/");
      return;
    }

    // Update Materi data
    axios
      .patch(
        `https://enormous-mint-tomcat.ngrok-free.app/admin/materi/${id}`,
        {
          judul: judulMateri,
          isi: isiMateri,
          linkVideo: videoMateri,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Materi updated successfully:", response.data);
        navigate(`/sharaftopik/${id}`);
      })
      .catch((error) => {
        console.error("Error updating materi data:", error);
      });
  };

  return (
    <Layout>
      <div className="h-full min-h-screen mt-0 pt-2">
        <div className="bg-white rounded-l-3xl min-h-[98.75vh] h-full pt-5 pl-4 pr-4">
          <div className="border rounded-xl flex flex-col p-2 mb-4 ml-2">
            <div className="flex items-center">
              <NavLink to={`/sharaftopik/${id}`}>
                <ArrowBackIcon className="text-dark-cyan" />
              </NavLink>
              <p className="text-dark-cyan text-2xl font-semibold ml-2">
                Materi
              </p>
            </div>
            <p className="text-sm">Anda dapat mengelola topik yang tersedia.</p>
            <div className="flex items-center">
              <a
                href={`/sharaf/${kategoriMateri}`}
                className="text-[#6D6D6D] text-sm"
              >
                Sharaf
              </a>
              <PlayArrowIcon
                style={{ fontSize: "16px" }}
                className="text-[#6D6D6D]"
              />
              <a href={`/sharaftopik/${id}`} className="text-[#6D6D6D] text-sm">
                Topik
              </a>
              <PlayArrowIcon
                style={{ fontSize: "16px" }}
                className="text-dark-cyan"
              />
              <a
                href={`/materisharaf/${id}`}
                className="text-dark-cyan text-sm font-medium"
              >
                Materi 1
              </a>
            </div>
          </div>
          <div className="w-full h-full">
            <form onSubmit={handleFormSubmit} className="w-full h-full">
              <div className="flex items-center ml-6 mb-4 justify-start">
                <div className="imageNamaMateri bg-dark-cyan p-4 bg-no-repeat w-fit object-center bg-center rounded-xl"></div>
                <p className="text-xl font-semibold ml-4">Nama Materi</p>
              </div>
              <input
                type="text"
                name="namaMateri"
                id="namaMateri"
                value={judulMateri}
                onChange={handleJudulMateriChange}
                className="border border-[#919191] w-3/4 ml-6 p-1 pl-3 rounded-xl mb-6"
              />
              <div className="flex items-center ml-6 mb-4 justify-start">
                <div className="imageVideoMateri bg-dark-cyan p-4 bg-no-repeat w-fit object-center bg-center rounded-xl"></div>
                <p className="text-xl font-semibold ml-4">Video</p>
              </div>
              <input
                type="text"
                name="videoMateri"
                id="videoMateri"
                value={videoMateri}
                onChange={handleVideoMateriChange}
                className="border border-[#919191] w-3/4 ml-6 p-1 pl-3 rounded-xl mb-6"
              />
              <div>
                <div className="flex items-center ml-6 mb-4 justify-start">
                  <div className="imageIsiMateri bg-dark-cyan p-4 bg-no-repeat w-fit object-center bg-center rounded-xl"></div>
                  <p className="text-xl font-semibold ml-4">Isi Materi</p>
                </div>
                <textarea
                  ref={textAreaRef}
                  value={isiMateri}
                  onChange={handleIsiMateriChange}
                  name="isimateri"
                  id="isimateri"
                  className="border border-[#919191] w-3/4 ml-6 p-1 pl-3 rounded-xl mb-6 overflow-hidden resize-none"
                  rows="10"
                ></textarea>
              </div>
              <button
                onClick={() => setShowPopup(true)}
                type="submit"
                className="p-2 pl-3 pr-3 bg-dark-cyan text-white rounded-lg ml-6 mb-2"
              >
                Simpan Materi <ArrowForwardIcon />
              </button>
            </form>
          </div>
        </div>
      </div>
      <PopupSuccess show={showPopup} onClose={() => setShowPopup(false)}>
        <div className="flex flex-col items-center">
          <div className="text-dark-cyan mb-4">
            <CheckCircleIcon style={{ fontSize: 60 }} />
          </div>
          <div>
            <p className="text-xl font-semibold">Materi Berhasil Di Update!</p>
          </div>
        </div>
      </PopupSuccess>
    </Layout>
  );
};

export default MateriSharaf;
