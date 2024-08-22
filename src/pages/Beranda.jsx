import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Layout from "./Layout";
import "./Beranda.css";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

const Beranda = () => {
  const [token, setToken] = useState("");
  const [nahwuId, setNahwuId] = useState("");
  const [sharafId, setSharafId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("user");
    if (accessToken) {
      setToken(accessToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchKategoriMateri = async () => {
      try {
        const response = await axios.get("https://enormous-mint-tomcat.ngrok-free.app/kategoriMateri", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true", // pindahin saat backend deploy
          },
        });
        if (response.status === 200) {
          const kategoriMateri = response.data.data;
          const nahwu = kategoriMateri.find((item) => item.jenis === "Nahwu");
          const sharaf = kategoriMateri.find((item) => item.jenis === "Sharaf");

          if (nahwu) {
            setNahwuId(nahwu.id);
          }
          if (sharaf) {
            setSharafId(sharaf.id);
          }
        } else {
          console.error("Gagal mendapatkan kategori materi");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (token) {
      fetchKategoriMateri();
    }
  }, [token]);

  return (
    <Layout>
      <div className="h-full mt-0 pt-2">
        <div className="bg-white rounded-l-3xl h-full pt-5 pb-5 pl-4 pr-2">
          <div className="text-dark-cyan text-2xl font-semibold pl-4">
            Beranda
          </div>
          <p className="text-sm mb-3 pl-4">
            Anda dapat melakukan pengelolaan untuk kategori nahwu dan sharaf.
          </p>
          <div className="flex justify-around w-full">
            <div className="w-8/12 bg-gradient-to-r from-[#EA9647] to-[#CB7624] rounded-xl p-1">
              <div className="flex-col bg-[#E08C3C] rounded-lg h-full">
                <div className="imageNahwu bg-cover h-44 w-full rounded-t-lg"></div>
                <div className="w-full pl-5 pt-3">
                  <p className="w-7/12 text-white text-sm">
                    Anda dapat melakukan pengelolaan materi, pembahasan, kuis
                    dan juga ujian untuk materi nahwu.
                  </p>
                  <NavLink to={`/nahwu/${nahwuId}`}>
                    <button className="bg-white text-orange-400 rounded-lg p-2 w-7/12 text-left text-sm mt-2 mb-2 font-medium flex justify-between group">
                      <p>Lihat Selengkapnya</p>
                      <ArrowCircleUpIcon className="rotate-90 group-hover:translate-x-1 transition delay-500 duration-300" />
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-3/12 mr-2 justify-between">
              <div className="h-52 w-full bg-gradient-to-r from-[#EA9647] to-[#CB7624] flex items-center justify-center rounded-xl">
                <p className="text-white text-7xl font-bold text-center leading-normal">
                  نحوو
                </p>
              </div>
              <div className="h-1/5 w-full bg-gradient-to-r from-[#EA9647] to-[#CB7624] flex items-center justify-center mt-3 rounded-xl p-1">
                <div className="h-full w-full rounded-lg bg-white">
                  <p className="bg-gradient-to-r from-[#EA9647] to-[#CB7624] text-transparent bg-clip-text text-4xl font-bold rounded-lg text-center leading-normal">
                    Nahwu
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-around w-full mt-4 pb-2">
            <div className="flex flex-col w-3/12 mr-2 justify-between">
              <div className="h-52 w-full bg-gradient-to-r from-[#0A8CA6] to-[#015869] flex items-center justify-center rounded-xl">
                <p className="text-white text-7xl font-bold text-center leading-normal">
                  شرف
                </p>
              </div>
              <div className="h-1/5 w-full bg-gradient-to-r from-[#0A8CA6] to-[#015869] flex items-center justify-center mt-3 rounded-xl p-1">
                <div className="h-full w-full rounded-lg bg-white">
                  <p className="bg-gradient-to-r from-[#0A8CA6] to-[#015869] text-transparent bg-clip-text text-4xl font-bold text-center leading-normal">
                    Sharaf
                  </p>
                </div>
              </div>
            </div>
            <div className="w-8/12 bg-gradient-to-r from-[#0A8CA6] to-[#015869] p-1 rounded-xl">
              <div className="flex-col bg-[#08839B] h-full rounded-lg">
                <div className="imageSharaf bg-cover h-44 w-full rounded-t-lg"></div>
                <div className="w-full pl-5 pt-3">
                  <p className="w-7/12 text-white text-sm">
                    Anda dapat melakukan pengelolaan materi, pembahasan, kuis
                    dan juga ujian untuk materi sharaf.
                  </p>
                  <NavLink to={`/sharaf/${sharafId}`}>
                    <button className="bg-white text-[#08839B] rounded-lg p-2 w-7/12 text-left text-sm mt-2 mb-2 font-medium flex justify-between group">
                      <p>Lihat Selengkapnya</p>
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

export default Beranda;
