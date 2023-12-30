import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "../api/axios";
import styled from "styled-components";
import "./styles/profil.css";

const Container = styled.div`
  #user-image {
    width: 150px;
    border-radius: 50%;
  }

  .p-fileupload-choose {
    margin-top: 10px;
    background-color: #1775f1;
  }

  .p-fileupload-choose:hover {
    background-color: #0c5fcd !important;
  }

  .settings .p-component {
    text-align: left !important;
  }

  #btn-modifier {
    background-color: #1775f1;
    border-color: #1775f1;
  }

  #btn-modifier:hover {
    background-color: #0c5fcd;
    border-color: #0c5fcd;
  }

  #btn-enregistrer {
    background-color: #1775f1;
    border-color: #1775f1;
  }

  #btn-enregistrer:hover {
    background-color: #0c5fcd;
    border-color: #0c5fcd;
  }

  #btn-enregistrer.hide {
    display: none;
  }

  input[type="file"]::file-selector-button {
    margin-right: 20px;
    border: none;
    background: #1775f1;
    padding: 10px 20px;
    border-radius: 10px;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
  }

  input[type="file"]::file-selector-button:hover {
    background: #0c5fcd;
  }
`;

const Profil = (props) => {
  const toast = useRef(null);
  const [data, setData] = useState();
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    axios
      .get(`/api/professors/${props.user.id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const onModifierClick = () => {
    const inputs = document.querySelectorAll(".text-base");
    inputs.forEach((input) => {
      input.disabled = false;
    });
    const inputUsername = document.getElementById("userName");
    inputUsername.focus();
    const btnEnregistrer = document.getElementById("btn-enregistrer");
    btnEnregistrer.classList.remove("hide");
  };

  const acceptFunc = (newData) => {
    axios
      .put(`/api/professors/${props.user.id}`, {
        lastName: newData.lastName,
        firstName: newData.firstName,
        userName: newData.userName,
        password: newData.password,
      })
      .then((response) => {
        console.log(response);
        axios
          .get(`/api/professors/${props.user.id}`)
          .then((response) => setData(response.data))
          .catch((error) => console.error(error));
      })
      .catch((error) => {
        console.error(error);
      });

    toast.current.show({
      severity: "info",
      summary: "Confirmé",
      detail: "Vous avez accepté",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejeté",
      detail: "Vous avez refusé",
      life: 3000,
    });
  };
  const confirm1 = (newData) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir modifier vos informations?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-primary",
      accept: () => acceptFunc(newData),
      reject,
    });
  };

  const onUpdate = () => {
    const lastName = document.getElementById("lastName").value;
    const firstName = document.getElementById("firstName").value;
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    let newData = {};
    if (password === "") {
      newData = { lastName, firstName, userName };
    } else {
      newData = { lastName, firstName, userName, password };
    }

    if (
      lastName !== props.user.id ||
      firstName !== props.user.id ||
      userName !== props.user.id ||
      password !== ""
    ) {
      confirm1(newData);
    }
    return;
  };

  const uploadPhoto = async () => {
    axios
      .put(
        `/api/professors/image/${props.user.id}`,
        { image: photo },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((response) => {
        console.log(response);
        axios
          .get(`/api/professors/${props.user.id}`)
          .then((response) => {
            setData(response.data);
            axios
              .get(`/api/professors/professor/${props.user.id}/image`, {
                responseType: "arraybuffer",
              })
              .then((response) => {
                const blob = new Blob([response.data], { type: "image/jpeg" });
                const imageUrl = URL.createObjectURL(blob);
                props.setPhoto(imageUrl);
                setPhoto(imageUrl);
              })
              .catch((error) => {
                console.error("Error fetching image:", error);
              });
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadPhoto();
  };
  return (
    <Container>
      <main>
        {!data ? (
          <ProgressSpinner />
        ) : (
          <>
            {" "}
            <h1 className="title">Profil</h1>
            <ul className="breadcrumbs">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li className="divider">/</li>
              <li>
                <a href="#" className="active">
                  Profil
                </a>
              </li>
            </ul>
            <div className="grid">
              <div
                className="imgContainer col-3 md:col2"
                style={{ margin: 30 }}
              >
                <Card>
                  <img
                    src={
                      props.photo
                        ? props.photo
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Photo"
                    id="user-image"
                  />
                  <div>
                    {data.lastName} {data.firstName}
                  </div>
                  <Toast ref={toast}></Toast>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/png, image/jpeg"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    ></input>
                    <Button
                      type="submit"
                      label="Enregistrer"
                      className="mt-2"
                      style={{
                        backgroundColor: "#1775f1",
                        borderColor: "#1775f1",
                      }}
                    />
                  </form>
                </Card>
              </div>
              <div className="settings col-8">
                <Card title="Infos personnelles">
                  <div className="card">
                    <div className="formgrid grid">
                      <div className="field col-12 md:col-6">
                        <label htmlFor="lastName">Nom</label>
                        <input
                          id="lastName"
                          type="text"
                          className=" text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.lastName}
                        />
                      </div>
                      <div className="field col-12 md:col-6">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                          id="firstName"
                          type="text"
                          className=" text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.firstName}
                        />
                      </div>
                      <div className="field col-12 md:col-6">
                        <label htmlFor="userName">Username</label>
                        <input
                          id="userName"
                          type="text"
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.userName}
                        />
                      </div>
                      <div className="field col-12 md:col-6">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                          id="password"
                          type="password"
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={""}
                        />
                      </div>
                      <div className="field col-12 md:col-3">
                        <button
                          type="button"
                          className="text-white px-3 py-2 text-base border-1 border-solid border-round cursor-pointer transition-all transition-duration-200"
                          id="btn-modifier"
                          onClick={onModifierClick}
                        >
                          Modifer
                        </button>
                      </div>
                      <div className="field col-12 md:col-3">
                        <Toast ref={toast} />
                        <ConfirmDialog />
                        <Button
                          onClick={onUpdate}
                          label="Enregistrer"
                          className="mr-2 hide"
                          id="btn-enregistrer"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </Container>
  );
};

export default Profil;
