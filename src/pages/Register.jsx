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

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const Register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://enormous-mint-tomcat.ngrok-free.app/register", {
        "username": nama,
        "email": email,
        "password": password,
        "retyped-password": confirmPassword
      });
      navigate("/");
    } catch (err) {
      if (err.response.data.message != null) {
        setMsg(err.response.data.message);
      } else {
        setMsg(err.response.data.data);
      }
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className="h-screen grid grid-cols-2">
      <div className="mt-10 ml-3">
        <div className="ml-14 mb-5">
          <img
            className="w-4/12"
            src="/assets/NashoLearn.jpg"
            alt="Nasho Learn"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="ml-14">
            <h1 className="text-dark-cyan font-bold text-xl">Buat Akun Anda</h1>
            <p className="mr-40 mb-5">
              Silahkan isi form di bawah ini untuk membuat akun dan lanjut untuk
              menggunakan Nasho Learn.
            </p>
            <form className="max-w-lg" onSubmit={Register}>
              <p className="text-center text-red-600">{msg}</p>
              <div className="mb-5">
                <label
                  htmlFor="nama"
                  className="block mb-2 text-sm font-medium text-dark-cyan"
                >
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
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
              </div>
              <div className="mb-10">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-dark-cyan"
                >
                  Konfirmasi Kata Sandi
                </label>
                <Input
                  id="confirmPassword"
                  type={visible2 ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-2 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                  placeholder="Masukkan ulang kata sandi"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setVisible2(!visible2)}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {visible2 ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-dark-cyan text-white text-sm font-semibold rounded-lg w-full p-2.5 group"
              >
                Daftar{" "}
                <ArrowForwardIcon className="group-hover:translate-x-2 transition delay-500 duration-300" />
              </button>
              <p className="mt-10 mb-10 text-center">
                Sudah punya akun?{" "}
                <Link
                  to={`/`}
                  className="text-dark-cyan underline font-semibold"
                >
                  Masuk
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <img className="w-9/12" src="/assets/GambarLR.jpg" alt="Gambar" />
      </div>
    </div>
  );
};

export default Register;
