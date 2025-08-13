import React from "react"
import EmailIcon from '@mui/icons-material/Email'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'

function Footer() {
  return (
    <footer className="footer-class blue-page" id="footer">
      <div>
        <div className="foot-header">
          <div style={{ flexBasis: "20%" }}>
            <img
              src={"/imgs/tec_logo_white_good.png"}
              style={{ maxWidth: "90%", boxShadow: 'none' }}
              alt="Tec Logo"
            />
          </div>
          <div className="foot-top-middle">
            <p style={{ width: "5rem" }}>Novus Tec</p>
          </div>
          <div style={{ flexBasis: "20%", paddingLeft: '1rem' }}>
            <p>Contact Us</p>
            <div style={{ display: "flex", gap: "1rem" }} className="footer-contacts">
              <a href="mailto:andrezala03@gmail.com" target="_blank">
                <EmailIcon />
              </a>
              <a href="https://wa.me/4422792232" target="_blank">
                <WhatsAppIcon />
              </a>
              <a href="https://tec.mx/es/queretaro" target="_blank">
                <CorporateFareIcon />
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            textAlign: "center",
            borderTop: "solid #073a5a 2px",
            fontSize: "small",
          }}
        >
          <p style={{ width: "80%", margin: "1rem auto 0 auto" }}>
            Se Prohibe la reproducción total o parcial del sitio o cualquier contenido del mismo
            instituto tecnológico y de estudios superiores de Monterrey, México. 2024 Epigmenio
            González 500, Fracc, San Pablo, C.P. 76130 | Santiago de Qro., Qro | México
          </p>
          <p>___________________________________________________</p>
          <p className="footer-avisos">
            <a href="#">Aviso de Privacidad</a> | <a href="#">Aviso Legal</a> |{" "}
            <a href="#">Políticas de Privacidad</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer
