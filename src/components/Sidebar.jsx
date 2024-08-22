import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Sidebar.css";
import { useNavigate, NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import PopupLogout from "./PopupLogout";

const SidebarMenu = () => {
  const [token, setToken] = useState("");
  const [nahwuId, setNahwuId] = useState("");
  const [sharafId, setSharafId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
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
        const response = await axios.get(
          "https://enormous-mint-tomcat.ngrok-free.app/kategoriMateri",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true", // pindahin saat backend deploy
            },
          }
        );
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

  const handleLogout = () => {
    Cookies.remove("user");
    setShowPopup(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <div id="app" className="h-full">
      <div className="h-screen flex flex-col justify-between sticky top-0">
        <Sidebar
          className="sidebar-custom"
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              backgroundColor: "#015869", // Change the background color here
            },
          }}
        >
          <Menu className="m-5">
            <div className="flex items-center mb-5">
              <img src="/assets/LogoBeranda.png" alt="Nasho Learn" />
              <div className="text-white text-xl font-semibold ml-2">
                Nasho Learn
              </div>
            </div>
            <NavLink to="/beranda">
              <MenuItem className="custom-menu-item" icon={<HomeIcon />}>
                Beranda
              </MenuItem>
            </NavLink>
            <NavLink to={`/nahwu/${nahwuId}`}>
              <MenuItem
                className="custom-menu-item"
                icon={<LibraryBooksIcon />}
              >
                Nahwu
              </MenuItem>
            </NavLink>
            <NavLink to={`/sharaf/${sharafId}`}>
              <MenuItem
                className="custom-menu-item"
                icon={<ImportContactsIcon />}
              >
                Sharaf
              </MenuItem>
            </NavLink>
          </Menu>
        </Sidebar>
        <div className="mb-16 ml-5 mr-5">
          <hr className="w-full mb-5" />
          <button
            className="bg-[#E57D1A] p-2 pl-3 pr-3 text-white rounded-xl w-full flex justify-between"
            onClick={() => setShowPopup(true)}
          >
            <p>Keluar Akun</p>
            <LogoutIcon />
          </button>
        </div>
      </div>
      <PopupLogout show={showPopup} onClose={() => setShowPopup(false)}>
        <div className="mt-2">
          <p className="text-base font-semibold">
            Apakah anda yakin untuk keluar dari akun anda?
          </p>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className="bg-white border-2 border-dark-cyan p-3 text-sm text-dark-cyan rounded-lg font-medium ml-2 mb-2"
            onClick={() => setShowPopup(false)}
          >
            Tidak
          </button>
          <button
            className="bg-[#B3261E] p-3 text-sm text-white rounded-lg font-medium ml-2 mb-2"
            onClick={() => handleLogout()}
          >
            Ya
          </button>
        </div>
      </PopupLogout>
    </div>
  );
};

export default SidebarMenu;
