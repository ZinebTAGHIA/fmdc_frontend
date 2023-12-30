import React, { useEffect, useState } from "react";
import logo from "../logos/logo-ensaj.png";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "../api/axios";

const Container = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    overflow: hidden;
  }
  ::selection {
    background: rgba(26, 188, 156, 0.3);
  }
  .container {
    max-width: 440px;
    padding: 0 20px;
    margin: 170px auto;
  }
  .wrapper {
    width: 100%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.1);
  }
  .wrapper .title {
    height: 90px;
    /* background: #16a085; */
    border-radius: 5px 5px 0 0;
    color: #000;
    font-size: 30px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wrapper form {
    padding: 30px 25px 25px 25px;
  }
  .wrapper form .row {
    height: 45px;
    margin-bottom: 15px;
    position: relative;
  }
  .wrapper form .row input {
    height: 100%;
    width: 100%;
    outline: none;
    padding-left: 60px;
    border-radius: 5px;
    border: 1px solid lightgrey;
    font-size: 16px;
    transition: all 0.3s ease;
  }
  form .row input:focus {
    border-color: #3b82f6;
    box-shadow: inset 0px 0px 2px 2px #e9ecef;
  }
  form .row input::placeholder {
    color: #999;
  }
  .wrapper form .row i {
    position: absolute;
    width: 47px;
    height: 100%;
    color: #fff;
    font-size: 18px;
    background: #3b82f6;
    border: 1px solid #3b82f6;
    border-radius: 5px 0 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wrapper form .pass {
    margin: -8px 0 20px 0;
  }
  .wrapper form .pass a {
    color: #3b82f6;
    font-size: 17px;
    text-decoration: none;
  }
  .wrapper form .pass a:hover {
    text-decoration: underline;
  }
  .wrapper form .button input {
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    padding-left: 0px;
    background: #3b82f6;
    border: 1px solid #3b82f6;
    cursor: pointer;
  }
  form .button input:hover {
    background: #3b82f6;
  }
`;

const Login = ({ setUser }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [accountErrors, setAccountErrors] = useState("");

  const shouldRedirect = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login || !password) return;
    axios
      .post("/api/auth/login", { userName: login, password: password })
      .then((response) => {
        if (response.status === 200) {
          if (
            response.data.role !== "ADMIN" &&
            response.data.role !== "PROFESSOR"
          ) {
            console.log(response.data);
            setAccountErrors(
              "Vous n'êtes pas autorisé à accéder à cette plateforme."
            );
            return;
          }
          localStorage.setItem("auth_token", response.data.accessToken);
          localStorage.setItem("user", JSON.stringify(response.data));
          setUser(JSON.parse(localStorage.getItem("user")));
          navigate("/");
        } else if (response.status === 401) {
          setAccountErrors("Bad credentials.");
        } else if (response.status === 403) {
          setAccountErrors("Bad credentials.");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setAccountErrors("Bad credentials.");
        } else if (error.response && error.response.status === 403) {
          setAccountErrors("Bad credentials.");
        }
      });
  };

  return (
    <Container>
      <div className="container">
        <div className="wrapper">
          <div className="title">
            <img src={logo}></img>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="row">
              <i className="bx bxs-user" />
              <input
                type="text"
                placeholder="Identifiant"
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>
            <div className="row">
              <i className="bx bxs-lock-alt"></i>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                required
              />
            </div>
            <span style={{ color: "red" }}>{accountErrors}</span>
            <div className="btn-pass">
              <div className="row button">
                <input type="submit" value="Connexion" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Login;
