# CFO Helper - Financial Dashboard & Business Simulation

** NOTE: THE `FINAL2` BRANCH CONTAINS THE MOST UP-TO-DATE CODE **

A comprehensive financial dashboard and business simulation tool for startup founders. The application consists of three main components:

1. **Financial Dashboard**: Real-time visualization of key financial metrics
2. **AI Assistant**: LLM-powered financial advisor
3. **Business Simulation**: Oregon Trail-style business decision simulator

## Features

### Financial Dashboard
- Real-time tracking of key metrics (MRR, ARR, Revenue Growth, etc.)
- Expense tracking and categorization
- Cash flow monitoring
- Runway calculation
- Transaction history

### AI Assistant
- Ask questions about your financial metrics
- Get advice on cost reduction
- Analyze business performance
- Historical Q&A tracking

### Business Simulation
- Make strategic business decisions
- Experience different market scenarios
- Track impact of decisions on key metrics
- Learn from historical decisions

## Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- OpenAI API key

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Initialize the database:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Start the backend server:
   ```bash
   python app.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## API Endpoints

### Metrics
- `GET /api/metrics` - Get all metrics
- `POST /api/metrics` - Add a new metric

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add a new transaction

### AI Assistant
- `POST /api/ask` - Ask a question to the AI assistant

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
