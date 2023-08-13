import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import styles from './Pagamento.module.scss';
import { AiOutlineSearch } from 'react-icons/ai';
import style from '../Inicio/Inicio.module.scss';
import styl from '../Consulta/Consulta.module.scss';
import logo from '../../assets/logo.svg'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import IOrder from '../../interfaces/IOrders';
import { Modal } from 'react-bootstrap';
import IOrders from '../../interfaces/IOrders';

export default function Pagamento() {

    const { clientId } = useParams();
    const valorPix = 'chavePIX@exemplo.com.br';
    const [termoDeBusca, setTermoDeBusca] = useState<string>("");
    const [resultadosBusca, setResultadosBusca] = useState<IOrders[]>([]);;
    const navigate = useNavigate();
    const [order, setOrder] = useState<IOrder>();
    const [orders, setOrders] = useState<IOrders[]>();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/orders')
            .then(resposta => {
                setOrders(resposta.data);
                console.log(resposta)
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/orders/${clientId}`)
            .then((response) => {
                setOrder(response.data);
                console.log(order)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [clientId])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const id = order?.client.id
        const name = order?.client.name
        const phone = order?.client.phone

        const formData = { "name": name, "phone": phone, "file": 'enviado, verificar', 'userStatus': "FALSE" }

        axios.put(`http://localhost:8080/users/${id}`, formData)
            .then((response) => {
                navigate('/', { replace: true })
            })
            .catch((error) => {
                console.log(error, formData);
            });
    };

    function procurarCliente() {
        const resultados = orders?.filter(order => order.client.phone === termoDeBusca);
        setResultadosBusca(resultados || []);
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <>
            <div className={style.cabecalho}>
                <img src={logo} alt="logo paido sorteio" className={style.logo} />
                <button className={style.botao_busca}>
                    <AiOutlineSearch />
                    <p className={style.nome_botao_busca} onClick={handleOpenModal}>MEUS NÚMEROS</p>
                </button>
            </div>
            <div className={styles.container}>
                <div className={styles.pagamento}>
                    <p className={styles.titulo_pagamento}>Pagamento via pix</p>
                    <QRCode value={valorPix} />
                    <p className={styles.titulo_pagamento}>Faça o pix de acordo com o valor total</p>
                </div>
                <div className={styles.detalhes}>
                    <p className={styles.detalhes_titulo}>Detalhes do pedido</p>
                    <p className={styles.sorteio}>Sorteio</p>
                    <p className={styles.nome_rifa}>{order?.items[0].raffle.name}</p>
                    <div className={styles.container_preco}>
                        <p className={styles.total_preco}>Total: </p>
                        <p className={styles.preco}>{order?.items[0].subTotal}</p>
                    </div>
                    <div className={styles.centraliza}>
                        <button className={styles.numeros_reservados}>Numeros reservados</button>
                    </div>
                    <div className={styl.centraliza}>
                        <div className={styles.container}></div>
                        <div className={styl.container_numeros}>
                            {order?.items[0].generatedNumbers.map((numero, numeroIndex) => (
                                <p key={numeroIndex} className={styl.numeros}>{numero}</p>
                            ))}
                        </div>

                    </div>


                    <form action="/upload" onSubmit={handleSubmit}>
                        <label htmlFor="">Selecione o comprovante: </label>
                        <input type="file" id="file" name="file" accept=".txt, .pdf, .doc, .docx" required></input>
                        <button type="submit" className={styles.botao_enviar}>Enviar</button>
                    </form>

                </div>
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                contentLabel="Login"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <div className={styles.modalHeader}>
                    <h2>Login</h2>
                    <button className={styles.modalCloseButton} onClick={handleCloseModal}>
                        <span>&times;</span>
                    </button>
                </div>
                <hr className={styles.modalLine} />
                <p>Para consultar seus pedidos, digite o número de WhatsApp usado na hora da compra:</p>
                <input
                    type="text"
                    name="Telefone"
                    className={styles.modalInput}
                    value={termoDeBusca}
                    onChange={(e) => setTermoDeBusca(e.target.value)}
                />
                <button className={styles.modalButton} onClick={() => {
                    procurarCliente();
                    navigate(`/consulta`, { state: { telefone: termoDeBusca } });
                }}>Consultar</button>
            </Modal>

        </>
    );
}




