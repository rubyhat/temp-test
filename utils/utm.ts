export type UTMProps = {
    utm_source: 'atlasbus';
    utm_campaign: 'seo';
    utm_content: 'morda' | 'city_page' | 'direction_page';
};

export type UTMCarbusProps = {
    utm_source: 'atlasbus';
    utm_campaign: 'carbus_partner_block';
    utm_term: string; // Название направления. Пример: Minsk-Hrodna
    utm_content: 'serp_card';
};
