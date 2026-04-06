import nodemailer from "nodemailer";

let mailer = null as unknown as nodemailer.Transporter;

async function createTransporter() {
  if (mailer) return mailer;

  const mode = process.env.MAIL_MODE || "normal";

  if (mode === "test") {
    // Cuenta de prueba (ethereal)
    const testAccount = await nodemailer.createTestAccount();
    mailer = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Mailer: usando cuenta de prueba nodemailer (ethereal)");
    return mailer;
  }

  // Si se especifica MAIL_HOST usamos configuración SMTP explícita
  if (process.env.MAIL_HOST) {
  const port = process.env.MAIL_PORT ? Number.parseInt(process.env.MAIL_PORT, 10) : 587;
    const secure = (process.env.MAIL_SECURE || "false") === "true";
    mailer = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port,
      secure,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    return mailer;
  }

  // Por defecto, intenta usar 'service' (gmail, outlook, etc.)
  mailer = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE || "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return mailer;
}

/**
 * Envía un código de verificación simple al correo del usuario.
 * Usado tanto para registro como para inicio de sesión con código.
 */
export async function sendVerificationEmail(to: string, code: string) {
  const transporter = await createTransporter();
  const from = process.env.MAIL_FROM || `"Soporte Maquinas Poker" <${process.env.MAIL_USER}>`;

  const message = `
Hola,

Tu código de verificación es: ${code}

Por favor, ingrésalo en la aplicación para continuar con el proceso de inicio de sesión.
Este código es válido por 5 minutos.

Si no solicitaste este código, puedes ignorar este mensaje.

Atentamente,
El equipo de soporte del Equipo de Maquinas de Poker
  `;

  const info = await transporter.sendMail({
    from,
    to,
    subject: "Código de verificación - Maquinas Poker - Inicio Session",
    text: message.trim(),
  });

  // Si estamos en modo test, nodemailer provee una URL para previsualizar el correo
  if ((process.env.MAIL_MODE || "") === "test") {
    // @ts-ignore: nodemailer typings for getTestMessageUrl
    const preview = nodemailer.getTestMessageUrl(info);
    console.log("Preview URL del email (ethereal):", preview);
  }

  return info;
}
