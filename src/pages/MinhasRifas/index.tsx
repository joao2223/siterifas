import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import IOrders from "../../interfaces/IOrders";
import styles from './MinhasRifas.module.scss';

export default function MinhasRifas() {
    const [orders, setOrders] = useState<IOrders[]>();
    const [termoDeBusca, setTermoDeBusca] = useState<string>("");
    const [resultadosBusca, setResultadosBusca] = useState<IOrders[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://site-de-rifas-0c8b9c43956a.herokuapp.com/orders`)
            .then(resposta => {
                setOrders(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    function procurarCliente() {
        const resultados = orders?.filter(order => order.client.phone === termoDeBusca);
        setResultadosBusca(resultados || []);
    }

    useEffect(() => {
        function voltaInicio() {
            navigate('/', { replace: true })
        }
        window.addEventListener('popstate', voltaInicio)
        return () => {
            window.removeEventListener('popstate', voltaInicio)
        }
    }, [])

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
            <p className={styles.titulo}>Para ver as rifas compradas, digite o seu telefone </p>
            <input
                type="text"
                name="Telefone"
                className={styles.input}
                value={termoDeBusca}
                onChange={(e) => setTermoDeBusca(e.target.value)}
            />
            <button className={styles.botao} onClick={() => procurarCliente()}>Pesquisar</button>

            <div className={styles.resultados}>
                {resultadosBusca.length > 0 ? (
                    <>
                        {resultadosBusca.map((order) => (
                            <div key={order.id} className={styles.resultado_busca}>
                                <p className={styles.infos}>Nome do cliente: {order.client.name}</p>
                                <p className={styles.infos}>Rifas:</p>
                                {order.items.map((item, index) => (
                                    <div key={index}>
                                        <p className={styles.infos}>Rifa {item.raffle.name}:</p>
                                        <ul className={styles.numeros_rifa}>
                                            {item.raffle.randomNumbers.map((number, idx) => (
                                                <li key={idx}>{number}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </>
                ) : (
                    <p>Nenhum resultado encontrado.</p>
                )}
            </div>
        </>
    );
}