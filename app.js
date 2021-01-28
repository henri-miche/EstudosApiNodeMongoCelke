const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

require('../api/models/orcamento');
const Orcamento = mongoose.model('Orcamento');

const app = express();

app.use(express.json());

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods",'GET, PUT,POST,DELETE')
  res.header("Access-Control-Allow-Headers",'X-PINGOTHER,Content-Type,Authorization,')
 app.use(cors());
 next();
}) 




mongoose.connect('mongodb://localhost/celke', {
  useNewUrlParser: true,
  useUnifiedTopology:true

}).then(()=>{
  console.log('Conexão com o bd mongodb realizado com sucesso!')
}).catch((err)=>{
  console.log('Conexão com o bd mongodb não realizado com sucesso: '+err)
});

app.post('/orcamento', async (req, res) => {
  console.log(req.body);
  await Orcamento.create(req.body, (err) => {
    if(err) return res.status(400).json({
      error: true,
      message: 'Erro :Solicitação de orçamento não enviada com sucesso!'
    })
  })

  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    
    auth: {
      user: 'ad9cbd7efc8825', // generated ethereal user
      pass: '2e62e413c02fef', // generated ethereal password
    },
  });

  var emailHtml ="Prezado(a),<br><br>Recebi a solicitação de orçamento.<br><br>Em breve será encaminhado o orçamento<br><br> ";
  var emailTeto = "Prezado(a),\n\nRecebi a solicitação de orçamento.\n\nEm breve será encaminhado o orçamento\n\n ";

  var emailSendInfo = {
    from: '81bf9748a9-7d13cf@inbox.mailtrap.io', // sender address
    to: req.body.email, // list of receivers
    subject: "Recebi a solicitação de orçamento", // Subject line
    text: emailTeto, // plain text body
    html: emailHtml, // html body
  }

  await transport.sendMail(emailSendInfo,function(err){
   if(err) return res.status(400).json({
      error: true,
      message: 'Erro :Solicitação de orçamento não enviada com sucesso!'
    });
    return res.json({
                error: false,
                message: 'Solicitação de orçamento enviada com sucesso!'
              });
  });
      
  
});

app.listen(8080, () =>{
    console.log('iniciado porta 8080')
} )