import logo from "../../assets/logo.svg";
import styles from "./Inicio.module.scss";
import rifas from "../../assets/Inicio/rifas.svg";
import sorteios from "../../assets/Inicio/sorteios.svg";
import rifas_facil from '../../assets/Inicio/rifas_facil.svg'
import pai_do_sorteio from '../../assets/Inicio/paidosorteio.svg'
import ver_tudo from '../../assets/Inicio/ver_tudo.svg'
import rifas_palavra from '../../assets/Inicio/rifas_palavra.svg'
import sorteio_palavra from '../../assets/Inicio/sorteio_palavra.svg'
import { Link, useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate()

  function redirecionarParaRifas() {
    navigate('/rifas', { replace: true })
  }

  function redirecionarParaSorteios() {
    navigate('/sorteios', { replace: true })
  }

  function redirecionarParaMinhasRifas() {
    navigate('/minhasrifas', { replace: true })
  }


  return (
    <>
      <div className={styles.cabecalho}>
        <img src={logo} alt="logo Paido sorteio" className={styles.logo} />
        <div>
          <Link className={styles.link} to='/'>Inicio</Link>
          <Link className={styles.link} to='/rifas'>Rifas</Link>
          <Link className={styles.link} to='/sorteios'>Sorteios</Link>
          <Link className={styles.link} to='/minhasrifas'>Minhas rifas</Link>
        </div>
      </div>
      <section className={styles.container}>
        <div>
          <div>
            <img src={pai_do_sorteio} alt="" className={styles.pai_do_sorteio} />
            <img src={rifas_facil} alt="" />
          </div>
          <div>
            <p className={styles.bem_vindo}>
              Bem vindo ao Nosso Mundo de Emoção e Sorte
            </p>
            <p className={styles.texto_bem_vindo}>
              Seja parte da diversão e da emoção das nossas incríveis rifas!
              Aqui é o lugar onde a sorte se encontra com a oportunidade, dando
              a todos a chance de ganhar prêmios emocionantes enquanto apoiam
              causas incríveis.
            </p>
            <button className={styles.botao_ver_tudo} onClick={() => redirecionarParaMinhasRifas()}><img src={ver_tudo} alt="" /></button>
          </div>
        </div>

        <div className={styles.container_botoes}>
          <div className={styles.container_botao}>
            <button className={styles.botao_nao_clicavel}><img src={rifas_palavra} alt="" /></button>
            <button className={styles.botao_clicavel} onClick={() => redirecionarParaSorteios()}>
              <img
                className={styles.imagem_botao}
                src={sorteios}
                alt="imagem sorteios"
              />
              <img src={sorteio_palavra} alt="" className={styles.nome_botao} />
              <p className={styles.info_botao}>
                Assista à contagem regressiva para o sorteio. Mantenha seus
                dedos cruzados enquanto o destino decide o vencedor!
              </p>
            </button>
          </div>
          <div className={styles.container_botao}>
            <button className={styles.botao_clicavel_rifas} onClick={() => redirecionarParaRifas()} >
              <img
                className={styles.imagem_botao}
                src={rifas}
                alt="imagem rifas"
              />
              <img src={rifas_palavra} alt="" className={styles.nome_botao} />
              <p className={styles.info_botao}>
                Navegue por nossa seleção de rifas atuais e escolha aquela que
                desperta seu interesse
              </p>
            </button>
            <button className={styles.botao_nao_clicavel}><img src={sorteio_palavra} alt="" /></button>
          </div>
        </div>
      </section>
    </>
  );
}
