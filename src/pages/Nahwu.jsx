import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CreateIcon from "@mui/icons-material/Create";
import topik from "../asset/Topik.svg";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const Nahwu = () => {
  const [data, setData] = useState(null);
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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://enormous-mint-tomcat.ngrok-free.app/materis?kategori=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token, id]);

  const dataTopik = ["Awal","Akhir"];
  const dataUjian = ["Tengah","Akhir"];
  let counterTopik = 1;
  let counterUjian = 1;

  return (
    <Layout>
      <div className="h-full min-h-screen mt-0 pt-2">
        <div className="bg-white rounded-l-3xl min-h-[98.75vh] h-full pt-5 pl-4 pr-4">
          <div className="border rounded-xl flex flex-col p-2 mb-4 ml-2">
            <p className="text-dark-cyan text-2xl font-semibold">
              List Topik dan Ujian
            </p>
            <p className="text-sm">
              Anda dapat mengelola topik beserta ujian yang tersedia.
            </p>
            <div className="flex items-center">
              <a href={`/nahwu/${id}`} className="text-[#6D6D6D] text-sm">
                Nahwu
              </a>
              <PlayArrowIcon
                style={{ fontSize: "16px" }}
                className="text-dark-cyan"
              />
              <a href={`/nahwu/${id}`} className="text-dark-cyan text-sm">
                Topik
              </a>
            </div>
          </div>
          {data &&
            data[0].materi.map((phase, index) => (
              <div key={index} className="flex justify-around w-full mb-4">
                <div className="w-[47.5%]">
                  <p className="text-dark-cyan text-2xl font-semibold mb-5">
                    Topik {dataTopik[index]}
                  </p>
                  {phase.materi.map((item, index) => (
                    <div
                      key={index}
                      className="flex p-4 rounded-xl items-center mb-4"
                      style={{
                        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      <img
                        src={topik}
                        alt="Gambar Topik"
                        className="w-16 flex-initial mr-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Topik {counterTopik++}
                        </p>
                        <p className="font-bold">{item.judul}</p>
                      </div>
                      <NavLink to={`/nahwutopik/${item.id}`}>
                        <button className="flex-initial bg-dark-cyan p-2 pl-3 pr-3 text-sm text-white rounded-lg font-medium">
                          Kelola Materi{" "}
                          <CreateIcon style={{ fontSize: "20px" }} />
                        </button>
                      </NavLink>
                    </div>
                  ))}
                </div>
                <div className="border-l-2 border-[#C2C2C2] min-h-[100vh] h-full"></div>
                <div className="w-[47.5%]">
                  <p className="text-dark-cyan text-2xl font-semibold mb-5">
                    Ujian {dataUjian[index]}
                  </p>
                  {phase.ujian.map((item, index) => (
                    <div
                      key={index}
                      className="flex p-4 rounded-xl items-center mb-4"
                      style={{
                        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      <img
                        src={topik}
                        alt="Gambar Ujian"
                        className="w-16 flex-initial mr-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Ujian {counterUjian++}
                        </p>
                        <p className="font-bold">Teori dasar Nahwu</p>
                      </div>
                      <NavLink to={`/ujiannahwu/${item.id}`}>
                        <button className="flex-initial bg-dark-cyan p-2 pl-3 pr-3 text-sm text-white rounded-lg font-medium">
                          Kelola Ujian{" "}
                          <CreateIcon style={{ fontSize: "20px" }} />
                        </button>
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Nahwu;
