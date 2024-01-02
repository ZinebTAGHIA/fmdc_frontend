import React, { useEffect, useRef, useState } from "react";
import logo from "../logos/fmdc_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "../api/axios";
import background from "./styles/background/background.png";
import { Toast } from "primereact/toast";

const Body = styled.body`
  background-image: url(${background});
  background-size: cover;
  position: relative;
  background-repeat: repeat-y;
  z-index: 1;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7); /* Opacité sombre */
    z-index: -1;
  }
`;

const Container = styled.div`
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
    height: 150px;
    border-radius: 5px 5px 0 0;
    color: #000;
    font-size: 30px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title img {
    height: 140px;
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
  const [forgotPwd, setForgotPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loginFormView, setLoginFormView] = useState(true);
  const [tokenFormView, setTokenFormView] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPwd, setConfirmNewPwd] = useState("");
  const [resetFormView, setResetFormView] = useState(false);

  const shouldRedirect = localStorage.getItem("auth_token");
  const navigate = useNavigate();
  const toast = useRef(null);

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

  const handleSubmitForgotPwd = (e) => {
    e.preventDefault();
    if (!email) return;
    axios
      .post("/api/auth/forgotPassword", {
        email: email,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setForgotPwd(false);
          setTokenFormView(true);
          setAccountErrors("");
          showSuccess("Un code est envoyé à l'adresse email saisie.");
        } else if (response.status === 404) {
          setAccountErrors("Email invalide.");
          return;
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setAccountErrors("Email invalide.");
        }
      });
  };

  const handleSubmitToken = (e) => {
    e.preventDefault();
    if (!token) return;
    axios
      .post("/api/auth/tokenValidation", {
        token: token,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setTokenFormView(false);
          setResetFormView(true);
          setAccountErrors("");
          showSuccess(
            "Code valide, vous pouvez réinitialiser votre mot de passe."
          );
        } else if (response.status === 404) {
          setAccountErrors("Code invalide.");
          return;
        } else if (response.status === 410) {
          setAccountErrors("Code expiré.");
          return;
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setAccountErrors("Code invalide.");
        } else if (error.response && error.response.status === 410) {
          setAccountErrors("Code expiré.");
        }
      });
  };

  const handleSubmitPasswordReset = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPwd) return;
    if (newPassword !== confirmNewPwd) {
      setAccountErrors(
        "Désolé, les mots de passe ne correspondent pas. Réessayez."
      );
      return;
    }
    axios
      .post("/api/auth/resetPassword", {
        newPassword: newPassword,
        token: token,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setResetFormView(false);
          setLoginFormView(true);
          setAccountErrors("");
          showSuccess("Mot de passe réinitialisé avec succès.");
        } else if (response.status === 404) {
          setAccountErrors("Code invalide.");
          return;
        } else if (response.status === 410) {
          setAccountErrors("Code expiré.");
          return;
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setAccountErrors("Code invalide.");
        } else if (error.response && error.response.status === 410) {
          setAccountErrors("Code expiré.");
        }
      });
  };
  const onForgotPasswordClick = (e) => {
    e.preventDefault();
    setLoginFormView(false);
    setForgotPwd(true);
    setAccountErrors("");
  };

  const onLoginClick = (e) => {
    e.preventDefault();
    setLoginFormView(true);
    setForgotPwd(false);
    setTokenFormView(false);
    setResetFormView(false);
    setAccountErrors("");
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  return (
    <Body>
      <Container>
        <div className="container">
          <Toast ref={toast} />
          <div className="wrapper">
            <div className="title">
              <img src={logo}></img>
            </div>
            {loginFormView && (
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
                <NavLink
                  style={{ color: "#3b82f6" }}
                  onClick={onForgotPasswordClick}
                >
                  Mot de passe oublié ?
                </NavLink>
              </form>
            )}

            {forgotPwd && (
              <form className="form" onSubmit={handleSubmitForgotPwd}>
                <div className="row">
                  <i className="bx bxs-envelope" />
                  <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <span style={{ color: "red" }}>{accountErrors}</span>
                <div className="btn-pass">
                  <div className="row button">
                    <input type="submit" value="Réinitialiser" />
                  </div>
                </div>
                <NavLink style={{ color: "#3b82f6" }} onClick={onLoginClick}>
                  Se connecter ?
                </NavLink>
              </form>
            )}

            {tokenFormView && (
              <form className="form" onSubmit={handleSubmitToken}>
                <div className="row">
                  <i className="bx bx-key" />
                  <input
                    type="text"
                    placeholder="Code"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>
                <span style={{ color: "red" }}>{accountErrors}</span>
                <div className="btn-pass">
                  <div className="row button">
                    <input type="submit" value="Envoyer" />
                  </div>
                </div>
                <NavLink style={{ color: "#3b82f6" }} onClick={onLoginClick}>
                  Se connecter ?
                </NavLink>
              </form>
            )}

            {resetFormView && (
              <form className="form" onSubmit={handleSubmitPasswordReset}>
                <div className="row">
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    id="password"
                    required
                  />
                </div>
                <div className="row">
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmNewPwd}
                    onChange={(e) => setConfirmNewPwd(e.target.value)}
                    id="password"
                    required
                  />
                </div>
                <span style={{ color: "red" }}>{accountErrors}</span>
                <div className="btn-pass">
                  <div className="row button">
                    <input type="submit" value="Enregistrer" />
                  </div>
                </div>
                <NavLink style={{ color: "#3b82f6" }} onClick={onLoginClick}>
                  Se connecter ?
                </NavLink>
              </form>
            )}
          </div>
        </div>
      </Container>
    </Body>
  );
};

export default Login;
