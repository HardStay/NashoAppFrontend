import React, { useState } from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Input from "@mui/material/Input";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({handleLogin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [msgPassword, setMsgPassword] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://enormous-mint-tomcat.ngrok-free.app/login", {
        "email": email,
        "password": password,
      });
      const accessToken = response.data.data.accessToken;
      handleLogin({ accessToken });
      navigate("/beranda");
    } catch (err) {
      if (err.response) {
        if (err.response.data.message != null) {
          if(err.response.data.message === "Password harus lebih dari 6 karakter") {
            setMsgPassword(err.response.data.message);
            setMsgEmail("");
            setMsg("");
          } else if (err.response.data.message === "Password Salah") {
            setMsgPassword(err.response.data.message);
            setMsgEmail("");
            setMsg("");
          } else if (err.response.data.message === "Password dibutuhkan") {
            setMsgPassword(err.response.data.message);
            setMsgEmail("");
            setMsg("");
          } else if (err.response.data.message === "Tidak ada akun yang ditemukan") {
            setMsgEmail(err.response.data.message);
            setMsgPassword("");
            setMsg("");
          } else if (err.response.data.message === "Email harus valid") {
            setMsgEmail(err.response.data.message);
            setMsgPassword("");
            setMsg("");
          }
          // setMsg(err.response.data.message);
        } else {
          setMsg(err.response.data.data);
        }
      }
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className="h-screen grid grid-cols-2">
      <div className="mt-6 ml-3">
        <div className="ml-14">
          <img
            className="w-4/12"
            src="/assets/NashoLearn.jpg"
            alt="Nasho Learn"
          />
        </div>
        <div>
          <img className="w-9/12" src="/assets/GambarLR.jpg" alt="Gambar" />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="ml-10">
          <h1 className="text-dark-cyan font-bold text-xl">
            Selamat Datang Kembali!
          </h1>
          <p className="mr-52 mb-5">
            Silahkan masukkan email dan juga password di bawah untuk mengakes ke
            dalam akunmu.
          </p>
          <form onSubmit={Auth} className="max-w-lg">
            <p className="text-center text-red-600 text-xs">{msg ? msg:""}</p>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-dark-cyan"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                placeholder="Masukkan email"
                required
              />
              <p className="text-red-600 text-xs">{msgEmail ? msgEmail:""}</p>
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-dark-cyan"
              >
                Kata Sandi
              </label>
              <Input
                id="password"
                type={visible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                placeholder="Masukkan kata sandi"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setVisible(!visible)}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {visible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                required
              />
              <p className="text-red-600 text-xs">{(msgPassword ? msgPassword:"")}</p>
            </div>
            {/* <div className="flex mb-5 justify-between">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3"
                />

                <label
                  htmlFor="remember"
                  className="ms-2 text-sm font-medium text-gray-900"
                >
                  Ingat Saya
                </label>
              </div>
              <Link className="text-sm font-medium text-gray-600">
                Lupa Kata Sandi?
              </Link>
            </div> */}
            <button
              type="submit"
              className="bg-dark-cyan text-white text-sm font-semibold rounded-lg w-full p-2.5 group"
            >
              Masuk <ArrowForwardIcon className="group-hover:translate-x-2 transition delay-500 duration-300" />
            </button>
            <p className="mt-10 text-center">
              Belum punya akun?{" "}
              <Link to={`/register`} className="text-dark-cyan underline font-semibold">
                Daftar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
