import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import logo from "../../assets/logo.svg";
import styles from "./Rifas.module.scss";
import sorteio from '../../assets/Rifas/sorteio.jpg'
import comprar_rifa from '../../assets/Rifas/comprar_rifa.svg'
import axios from "axios";
import IRifa from "../../interfaces/IRifa";

export default function Rifas() {

    const [rifas, setRifas] = useState<IRifa[]>()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('https://site-de-rifas-0c8b9c43956a.herokuapp.com/raffles')
            .then(resposta => {
                setRifas(resposta.data)
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);
    

    useEffect(() => {
        function voltaInicio() {
            navigate('/', { replace: true })
        }
        window.addEventListener('popstate', voltaInicio)
        return () => {
            window.removeEventListener('popstate', voltaInicio)
        }
    }, [])

    function redirecionarParaCompra(id: number) {
        navigate(`/compra/${id}`, { replace: true })
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
            <p className={styles.titulo_rifas}>Rifas abertas</p>
            <section className={styles.centraliza}>
                {rifas?.map((rifa) => (
                    <div className={styles.container}>
                        <div key={rifa.id}>
                            <div>
                                <p className={styles.preco}>{rifa.price}</p>
                            </div>
                            <img src={sorteio} alt="imagem rifa" className={styles.imagem_rifa} />
                            <p className={styles.descricao}>{rifa.description}</p>
                            <p className={styles.data}>Sorteio: data</p>
                            <button className={styles.botao_comprar_rifas} onClick={() => redirecionarParaCompra(rifa.id)}>
                                <img src={comprar_rifa} alt="" />
                            </button>
                        </div>
                    </div>
                ))}

            </section>
        </>
    );
}