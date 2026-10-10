const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Simulação de base de dados em memória
let userWallet = {
    userId: 'user_01',
    username: 'Mark Ehiala',
    balance: 1000.00 // 1000 MT iniciais
};

// Rota para consultar o saldo
app.get('/api/balance', (req, res) => {
    res.json({ balance: userWallet.balance });
});

// Rota para processar a aposta com segurança no servidor
app.post('/api/bet', (req, res) => {
    const { amount, choice } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valor de aposta inválido.' });
    }

    if (!['cara', 'coroa'].includes(choice)) {
        return res.status(400).json({ error: 'Escolha inválida.' });
    }

    if (amount > userWallet.balance) {
        return res.status(400).json({ error: 'Saldo insuficiente na carteira.' });
    }

    userWallet.balance -= amount;

    const outcomes = ['cara', 'coroa'];
    const gameResult = outcomes[Math.floor(Math.random() * outcomes.length)];

    let won = false;
    let payout = 0;

    if (gameResult === choice) {
        won = true;
        payout = amount * 2;
        userWallet.balance += payout;
    }

    res.json({
        success: true,
        gameResult,
        won,
        payout: won ? payout : 0,
        newBalance: userWallet.balance
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Muiane.Bet Backend a rodar na porta ${PORT}`);
});
