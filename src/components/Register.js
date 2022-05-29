import React from "react";
import { Link, Navigate } from "react-router-dom";

import CurrentUserContext from "../contexts/CurrentUserContext";
import InfoTooltip from "./InfoTooltip";

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const Register = (props) => {
  const { onRegister } = props;

  const currentUser = React.useContext(CurrentUserContext);

  const [openInfoModal, setOpenInfoModal] = React.useState(false);
  const [values, setValues] = React.useState(INITIAL_VALUES);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleOpenInfoModal = () => setOpenInfoModal(true);
  const handleCloseInfoModal = () => setOpenInfoModal(false);

  if (currentUser) {
    return <Navigate replace to="/" />;
  }

  const handleChange = (event) =>
    setValues((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSubmitting(true);

      await onRegister(values);
      setValues(INITIAL_VALUES);
    } catch (error) {
      setError(error);
    } finally {
      handleOpenInfoModal();
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="auth">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__header">
            <h3>Регистрация</h3>
          </div>

          <div className="auth-form__body">
            <div className="auth-form__row">
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                className="auth-form__input"
                value={values.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form__row">
              <input
                required
                type="password"
                name="password"
                placeholder="Пароль"
                className="auth-form__input"
                value={values.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="auth-form__footer">
            <button type="submit" disabled={submitting}>
              Зарегистрироваться
            </button>

            <p>
              <Link to="/sign-in">Уже зарегистрированы? Войти</Link>
            </p>
          </div>
        </form>
      </main>

      <InfoTooltip
        type={!!error ? "error" : "success"}
        isOpen={openInfoModal}
        onClose={handleCloseInfoModal}
      />
    </>
  );
};

export default Register;
