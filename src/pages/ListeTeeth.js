import React, { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Link } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Field, Form } from "react-final-form";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";
import "./styles/list.css";

const ListeTeeth = () => {
  const [data, setData] = useState();
  const [currentTooth, setCurrentTooth] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/teeth`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});
  }, []);

  const getSeverity = () => {
    return "info";
  };

  const operationsBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="card flex justify-content-center">
          <Dialog
            header="Modifier une dent"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            <div className="form">
              <div
                className="flex justify-content-center"
                style={{ justifyContent: "center" }}
              >
                <div className="card">
                  <Form
                    onSubmit={onSubmit}
                    initialValues={{
                      name: currentTooth.name,
                    }}
                    validate={validate}
                    render={({ handleSubmit }) => (
                      <form onSubmit={handleSubmit} className="p-fluid">
                        <Field
                          name="name"
                          render={({ input, meta }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="name"
                                  {...input}
                                  autoFocus
                                  className={classNames({
                                    "p-invalid": isFormFieldValid(meta),
                                  })}
                                />
                                <label
                                  htmlFor="name"
                                  className={classNames({
                                    "p-error": isFormFieldValid(meta),
                                  })}
                                >
                                  Intitulé*
                                </label>
                              </span>
                              {getFormErrorMessage(meta)}
                            </div>
                          )}
                        />
                        <Button
                          type="submit"
                          label="Enregistrer"
                          className="mt-2"
                        />
                      </form>
                    )}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        </div>
        <div className="card flex justify-content-between">
          <Button
            onClick={() => confirm1(rowData.id)}
            icon="bx bx-trash"
            label="Supprimer"
            className="mr-2"
            severity="danger"
            style={{ marginRight: 20 }}
          ></Button>
          <Button
            icon="bx bx-edit-alt"
            label="Modifier"
            onClick={() => {
              setCurrentTooth(rowData);
              setVisible(true);
            }}
          ></Button>
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
  };

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";

    return (
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={value || ""}
          onChange={(e) => onGlobalFilterChange(e)}
          placeholder="Global Search"
        />
      </span>
    );
  };

  const header = renderHeader();

  const acceptFunc = (id) => {
    axios
      .delete(`/api/teeth/${id}`)
      .then((response) => {
        axios
          .get(`/api/teeth`)
          .then((response) => setData(response.data))
          .catch((error) => {});
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Dent supprimée.",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Erreur",
          detail: "Cette dent ne peut pas être supprimée !",
          life: 3000,
        });
      });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejeté",
      detail: "Suppression annulée.",
      life: 3000,
    });
  };

  const confirm1 = (id) => {
    confirmDialog({
      message: "Êtes-vous sûr de vouloir supprimer cette dent?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => acceptFunc(id),
      reject,
    });
  };

  const onSubmit = (data) => {
    setFormData(data);
    axios
      .put(`/api/teeth/${currentTooth.id}`, {
        name: data.name,
      })
      .then((response) => {
        axios
          .get(`/api/teeth`)
          .then((response) => setData(response.data))
          .catch((error) => {});
      })
      .catch((error) => {});
    setVisible(false);
    setShowMessage(true);
  };

  const validate = (data) => {
    let errors = {};
    if (!data.name) {
      errors.name = "L'intitulé est obligatoire.";
    }
    return errors;
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);

  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  const groupedItemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  return (
    <div>
      <main>
        {!data ? (
          <ProgressSpinner />
        ) : (
          <>
            <Dialog
              visible={showMessage}
              onHide={() => setShowMessage(false)}
              position="top"
              footer={dialogFooter}
              showHeader={false}
              breakpoints={{ "960px": "80vw" }}
              style={{ width: "30vw" }}
            >
              <div
                className="flex align-items-center flex-column pt-6 px-3"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <i
                  className="pi pi-check-circle"
                  style={{ fontSize: "5rem", color: "var(--green-500)" }}
                ></i>
                <h5>Dent Modifiée avec succès!</h5>
              </div>
            </Dialog>
            <h1 className="title">Dents</h1>
            <ul className="breadcrumbs">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li className="divider">/</li>
              <li>
                <a href="#" className="active">
                  Liste des dents
                </a>
              </li>
            </ul>
            <Toast ref={toast} />
            <ConfirmDialog />
            <DataTable
              value={data}
              header={header}
              filters={filters}
              paginator
              rows={10}
              emptyMessage="Aucune dent trouvée."
            >
              <Column field="id" header="ID" sortable />
              <Column field="name" header="Intitulé" />
              <Column
                field="operations"
                header="Opérations"
                body={(rowData) => operationsBodyTemplate(rowData)}
              />
            </DataTable>
          </>
        )}
      </main>
    </div>
  );
};

export default ListeTeeth;
