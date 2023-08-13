import styles from './ConfigAdmin.module.scss'
import rifados from '../../assets/Inicio/rifados.jpg'
import logo from '../../assets/logo.svg'

export default function ConfigAdmin() {
    return (
        <>
            <h2 className={styles.titulo}>Configurações</h2>

            <div className={styles.container_imagens}>
                <div className={styles.titulo_mais_imagem}>
                    <p>Banner atual:</p>
                    <img src={rifados} alt="" className={styles.imagem}/>
                </div>

                <div>
                    <p>Logo atual:</p>
                    <img src={logo} alt="" className={styles.imagem}/>
                </div>
            </div>

            <div className={styles.centraliza}>
                <form action="submit" className={styles.container_formulario}>
                    <input type="text" placeholder="Digite o link do banner principal" className={styles.input} />
                    <input type="text" placeholder="Digite o link da logo" className={styles.input} />
                    <button className={styles.botao_atualizar}>Atualizar</button>
                </form>
            </div>

        </>
    )
}