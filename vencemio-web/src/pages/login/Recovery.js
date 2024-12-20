import React from "react";
import "./Recovery.css";

function RecoverSuper() {
  return (
    <div className="recover-super">
      <div className="recover-super-container">
        <h1>Recuperar Cuenta</h1>
        <p>
          Para recuperar tu cuenta, envía un correo a <strong>matizalazar2001@gmail.com</strong> con la siguiente información:
        </p>
        <ul>
          <li>Tu correo registrado.</li>
          <li>La contraseña que piensas que tenías antes.</li>
          <li>La nueva contraseña que deseas establecer.</li>
        </ul>
        <p>
          Una vez que recibamos tu correo, procesaremos tu solicitud y te enviaremos una respuesta con la nueva contraseña configurada.
        </p>
        <p>
          <strong>Nota:</strong> Asegúrate de que el correo sea correcto para evitar problemas en el proceso.
        </p>
      </div>
    </div>
  );
}

export default RecoverSuper;
