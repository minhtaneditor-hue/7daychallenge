import { BANK_ID, ACCOUNT_NO, ACCOUNT_NAME } from './_lib/constants.js';

export default async function handler(req, res) {
    try {
        const data = {
            bank_id: BANK_ID,
            account_no: ACCOUNT_NO,
            account_name: ACCOUNT_NAME,
            qr_template: 'template_01'
        };
        
        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate'); 
        return res.status(200).json(data);
    } catch (error) {
        console.error('Config Error:', error);
        return res.status(500).json({ error: 'Failed to provide config' });
    }
}
