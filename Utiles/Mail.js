import nodemailer from "nodemailer";

export const SendMAil = async (linkVeryfation, email, subject, desc) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL_APP, // your email
      pass: process.env.GOOGLE_GMAIL_APP_PASSWORD, // your email password
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"blog" <' + process.env.MY_EMAIL_APP + ">", // اسم شركتك كمرسل
    // from: "اول بأول ",
    to: email, // list of receivers
    subject, // Subject line
    text: `Welcom ${email}`, // plain text body
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcom to in your blog</title>
   <style type="text/css">
    /* inline styles */
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      width: 100%;
      max-width: 600px;
      padding: 50px;
      margin: 0 auto;
      background-color: #f0f7ff;
      box-sizing: border-box;
    }

    h1,
    p {
      color: #333;
      margin: 0;
      width: 90%;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
      margin-bottom: 20px;
    }

    a {
      text-decoration: none;
      color: #195091;
    }

    .button {
      display: inline-block;
      background-color: #195091;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      padding: 10px 20px;
      border-radius: 4px;
      text-decoration: none;
    }

    @media only screen and (max-width: 768px) {
      .container {
        padding: 30px;
      }

      h1 {
        font-size: 20px;
      }

      p {
        font-size: 14px;
      }
    }

    @media only screen and (max-width: 480px) {
      .container {
        padding: 20px;
      }

      h1 {
        font-size: 18px;
      }

      p {
        font-size: 12px;
      }

      .button {
        font-size: 14px;
        padding: 8px 16px;
      }
    }
  </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcom to in your blog/h1>
      <p>Welcom ${email}</p>
      <p>
       ${desc}
      </p>
      <a href=${linkVeryfation}>
      ${linkVeryfation}
      </a>
      <p>
        if you have any question please contact us
        <a href="https://wa.me/+201064702174">Contact Us</a>
      </p>
    </div>
  </body>
</html>
`, // html body
  };

  // send mail with defined transport object
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
