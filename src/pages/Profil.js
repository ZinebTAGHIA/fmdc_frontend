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
  .grid {
    display: flex;
  }

  .imgContainer {
    flex: 1;
    margin: 30px;
  }

  .settings {
    flex: 3;
    margin-right: 100px;
    color: #495057;
  }

  #photo {
    margin: 5px;
  }

  input[type="text"],
  input[type="password"],
  input[type="email"] {
    width: 300px;
    height: 35px;
    border-radius: 3px;
    border-width: thin;
    margin-top: 8px !important;
    color: #495057;
    font-size: 1rem;
    font-weight: normal;
  }
  #userName:hover,
  #password:hover,
  #email:hover {
    border-color: #2196f3;
  }
  #userName:focus,
  #email:focus,
  #password:focus {
    border-color: #2196f3;
    box-shadow: 0 0 0 1px #2196f3, 0 0 0 3px rgba(33, 150, 243, 0.3);
    outline: none;
  }

  .formgrid {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 5px));
    grid-gap: 0;
  }

  .field {
    width: 100%;
    box-sizing: border-box;
  }

  .field input {
    width: calc(100% - 20px);
    padding: 10px;
  }
  .p-card-body {
    padding-right: 41px;
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
      .catch((error) => {});
  }, [props.user.id]);
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
        email: newData.email,
        password: newData.password,
      })
      .then((response) => {
        axios
          .get(`/api/professors/${props.user.id}`)
          .then((response) => setData(response.data))
          .catch((error) => {});
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Données modifiées.",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Erreur",
          detail: "Email ou Username déjà utilisé.",
          life: 3000,
        });
      });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejeté",
      detail: "Modification annulée.",
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
    const email = document.getElementById("email").value;

    let newData = {};
    if (password === "") {
      newData = { lastName, firstName, userName, email };
    } else {
      newData = { lastName, firstName, userName, password, email };
    }

    if (
      lastName !== data.lastName ||
      firstName !== data.firstName ||
      userName !== data.userName ||
      email !== data.email ||
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
          .catch((error) => {});
      })
      .catch((error) => {});
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
                      <div className="field col-12 md:col-6">
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          type="email"
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          disabled
                          defaultValue={data.email}
                        />
                      </div>
                      <div className="field col-12 md:col-3"></div>

                      <div className="field col-12 md:col-3">
                        <Button
                          label="Modifier"
                          className="mr-2 hide"
                          id="btn-modifier"
                          onClick={onModifierClick}
                        ></Button>
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
