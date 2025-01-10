import { FC, useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./AccountForm.module.scss";

const AccountForm: FC = () => {
  const userContext = useUser();

  const [formData, setFormData] = useState({
    email: userContext.user?.email || "",
    password: "",
    firstname: userContext.user?.firstname || "",
    lastname: userContext.user?.lastname || "",
    profileImage: null as File | null,
    backgroundImage: null as File | null,
  });

  useEffect(() => {
    setFormData({
      email: userContext.user?.email || "",
      password: "",
      firstname: userContext.user?.firstname || "",
      lastname: userContext.user?.lastname || "",
      profileImage: null,
      backgroundImage: null,
    });
  }, [userContext.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profileImage" | "backgroundImage"
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      [field]: file,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <div className={styles.formContainer}>
      <h2>Ustawienia konta</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Nowe hasło:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Wpisz nowe hasło"
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="firstname">Imię:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="lastname">Nazwisko:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="profileImage">Zdjęcie profilowe:</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "profileImage")}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="backgroundImage">Zdjęcie tła:</label>
          <input
            type="file"
            id="backgroundImage"
            name="backgroundImage"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "backgroundImage")}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
};

export default AccountForm;
