import { isServer } from 'utils/platform';
import axios, { AxiosPromise, AxiosResponse } from 'axios';

const APITemplateBaseURL = 'https://api.apitemplate.io';
const APITemplateApiKey = isServer
    ? 'adf0NDAxODoxMDI5OktUMldjOFpmY3ZNRjVXVGM'
    : null;

/**
 * @see https://docs.apitemplate.io/api/index.html#create-an-image-jpeg-and-png
 */
type APITemplateCreateImageResponse = {
    download_url: string;
    download_url_png: string;
    template_id: string;
    transaction_ref: 'string';
    status: string;
};

/**
 * Сервис для генерации картинок.
 * @see https://apitemplate.io/
 */
export function generatePromocodeShareImage(
    promocode: string
): AxiosPromise<APITemplateCreateImageResponse> {
    const templateId = '3f877b2b1b277182';

    return axios.post(
        APITemplateBaseURL + '/v1/create',
        {
            overrides: [
                {
                    name: 'promocode',
                    text: promocode,
                },
            ],
        },
        {
            headers: {
                'X-API-KEY': APITemplateApiKey,
            },
            params: {
                template_id: templateId,
            },
        }
    );
}
