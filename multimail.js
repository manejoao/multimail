const nodemailer = require('nodemailer');

class Multimail {
  md(texto, participante) {
    return texto.replace(/#([A-Z]*)/g, (match, p1) => participante[p1]);
  }

  sendMail(conf, participante) {
    const transporterOpts = {
      host: conf.MAIL_HOST,
      port: conf.MAIL_PORT,
      secure: conf.MAIL_SECURE === 'true',
      auth: {
        user: conf.MAIL_AUTH_USER,
        pass: conf.MAIL_AUTH_PASS,
      },
    };

    const transporterDfts = {
      from: conf.MAIL_FROM,
    };

    const transporter = nodemailer.createTransport(
      transporterOpts,
      transporterDfts
    );

    const to = `"${participante.NOME}" <${participante.EMAIL}>`;

    return transporter.sendMail({
      to,
      subject: this.md(conf.MSG_TITLE, participante),
      text: this.md(conf.MSG_BODY, participante).replace(/(<([^>]+)>)/gi, ''),
      html: this.md(conf.MSG_BODY, participante),
      attachments: [
        {
          path: participante.CERTIFICADO,
        },
      ],
    });
    // .then((res) => {
    //   console.log(
    //     `ENVIADA COM SUCESSO from: "${res.envelope.from}" to: "${res.envelope.to}" messageId: "${res.messageId}"`
    //   );
    // })
    // .catch((err) => {
    //   console.error(`ERRO AO ENVIAR to: ${to}`, err);
    // });
  }
}
module.exports = new Multimail();