import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const SharafTopik = () => {
  const [kategoriMateri, setKategoriMateri] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState("");
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
          `https://enormous-mint-tomcat.ngrok-free.app/materi/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response.status === 200) {
          setKategoriMateri(response.data.data[0].kategori);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token, id]);
  return (
    <Layout>
      <div className="h-full min-h-screen mt-0 pt-2 w-full">
        <div className="bg-white rounded-l-3xl min-h-[98.75vh] h-full pt-5 pl-4 pr-4">
          <div className="rounded-xl flex flex-col p-2 mb-4 ml-2">
            <p className="text-dark-cyan text-2xl font-semibold">Topik 1</p>
            <p className="text-sm">
              Anda dapat mengelola materi, kuis, ujian dan pembahasan.
            </p>
            <div className="flex items-center">
              <a href={`/sharaf/${kategoriMateri}`} className="text-dark-cyan text-sm">
                Sharaf
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-evenly w-full">
            <div className="flex mb-5 w-full">
              <div className="imageMateri bg-cover w-full h-64 bg-gradient-to-r from-[#2B9C93] to-[#2B9C93] rounded-xl p-1">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <p className="text-[#015869] text-xl font-semibold pl-5 pb-3 pt-3">
                      Materi
                    </p>
                    <p className="w-8/12 text-dark-cyan text-sm pl-5">
                      Anda dapat menambahkan, mengubah dan menghapus materi.
                    </p>
                  </div>
                  <NavLink to={`/materisharaf/${id}`}>
                    <button className="w-4/12 bg-white text-[#015869] border-2 border-dark-cyan rounded-lg p-2 text-left text-sm mt-2 mb-7 font-medium flex justify-between group ml-5">
                      <p>Kelola Materi</p>{" "}
                      <ArrowCircleUpIcon className="rotate-90 group-hover:translate-x-1 transition delay-500 duration-300" />
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex mb-5 w-full">
              <div className="imageKuis bg-cover w-full h-64 bg-gradient-to-r from-[#2B9C93] to-[#2B9C93] rounded-xl p-1">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <p className="text-[#6619AF] text-xl font-semibold pl-5 pb-3 pt-3">
                      Kuis
                    </p>
                    <p className="w-8/12 text-[#6619AF] text-sm pl-5">
                      Anda dapat menambahkan, mengubah dan menghapus kuis.
                    </p>
                  </div>
                  <NavLink to={`/kuissharaf/${id}`}>
                    <button className="w-4/12 bg-white text-[#6619AF] border-2 border-[#6619AF] rounded-lg p-2 text-left text-sm mt-2 mb-7 font-medium flex justify-between group ml-5">
                      <p>Kelola Kuis</p>{" "}
                      <ArrowCircleUpIcon className="rotate-90 group-hover:translate-x-1 transition delay-500 duration-300" />
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SharafTopik;
