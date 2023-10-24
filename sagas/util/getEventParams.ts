export interface IState {
    searchForm: {
        fromValue: any;
        toValue: any;
        [key: string]: any;
    };
    user: {
        ordersCount: number;
        hashedPhone: string;
        [key: string]: any;
    };
    order: any;
    [key: string]: any;
}

export const getEventParams = (event: string, state: IState) => {
    if (!state) return;
    const {
        searchForm,
        user: { ordersCount: orders_count, hashedPhone: user_id },
    } = state;

    const from_name = searchForm.fromValue && searchForm.fromValue.name;
    const from_id = searchForm.fromValue && searchForm.fromValue.id;
    const to_name = searchForm.toValue && searchForm.toValue.name;
    const to_id = searchForm.toValue && searchForm.toValue.id;

    let payObj;
    if (state.order.order) {
        const {
            currency,
            price,
            onlinePrice: online_price,
        } = state.order.order.rideInfo;
        payObj = { currency, price, online_price };
    }

    const authorized = user_id ? true : false;
    const userObj = { authorized, orders_count, user_id };
    const cityObj = { from_id, from_name, to_id, to_name };

    if (['authorization', 'registerNewUser', 'oldLoginUser'].includes(event)) {
        return userObj;
    }
    if (event === 'Search') return { ...userObj, ...cityObj };
    return { ...userObj, ...cityObj, ...(payObj ? payObj : {}) };
};
