export default interface IOrder {
    id: number;
    client: {
        id: number;
        name: string;
        phone: string;
    };
    items: Array<{
        quantity: number;
        quantityRaffle: number;
        price: string;
        subTotal: string;
        raffle: {
            id: number;
            quantity: number;
            name: string;
            description: string;
            price: string;
            imgUrl: string;
            raffleStatus: string;
            randomNumbers: Array<number>;
        };
    }>;
}