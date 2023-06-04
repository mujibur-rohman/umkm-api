const createEmailTransporter = require("../utils/createEmailTransporter");

module.exports = async (user) => {
  const transporter = createEmailTransporter();
  const mailOptions = {
    from: '"Verification Email UMKM E-Niaga" <mujiburrohman065@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: "Verifikasi Email", // Subject line
    html: `<p>Demi keamanan, klik tulisan dibawah ini untuk aktivasi email.</p>
      <a style="background-color:#0591f5; color:#fff; padding: 3px 5px; display:inline-block; text-decoration:none; border-radius:5px;" href="${process.env.CLIENT_URL}/verified/${user.uuid}">Verifikasi Email</a>
    `,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent");
    }
  });
};
