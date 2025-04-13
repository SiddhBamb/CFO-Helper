from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import requests
import random

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cfo_helper.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Ollama configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "phi"  # Using phi model for faster responses

# Models
class FinancialMetrics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    metric_name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)  # 'income' or 'expense'
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.DateTime, default=datetime.utcnow)

def seed_database():
    print("Starting database seeding...")
    # Clear existing data
    db.session.query(FinancialMetrics).delete()
    db.session.query(Transaction).delete()

    # Sample metrics
    metrics_data = [
        # Revenue & Income
        {'metric_name': 'MRR', 'value': 75000, 'category': 'revenue'},
        {'metric_name': 'ARR', 'value': 900000, 'category': 'revenue'},
        {'metric_name': 'Revenue Growth', 'value': 15.5, 'category': 'revenue'},
        {'metric_name': 'ARPU', 'value': 199, 'category': 'revenue'},
        {'metric_name': 'LTV', 'value': 2388, 'category': 'revenue'},
        {'metric_name': 'Paying Customers', 'value': 377, 'category': 'customers'},
        {'metric_name': 'Churned Revenue', 'value': 5000, 'category': 'revenue'},
        
        # Expenses & Burn
        {'metric_name': 'Operating Expenses', 'value': 45000, 'category': 'expenses'},
        {'metric_name': 'COGS', 'value': 15000, 'category': 'expenses'},
        {'metric_name': 'Gross Margin', 'value': 80, 'category': 'profitability'},
        {'metric_name': 'Net Burn', 'value': -15000, 'category': 'burn'},
        {'metric_name': 'Marketing Spend', 'value': 12000, 'category': 'expenses'},
        {'metric_name': 'R&D Spend', 'value': 25000, 'category': 'expenses'},
        
        # Profitability
        {'metric_name': 'Net Income', 'value': -15000, 'category': 'profitability'},
        {'metric_name': 'EBITDA', 'value': -10000, 'category': 'profitability'},
        
        # Cash & Runway
        {'metric_name': 'Cash on Hand', 'value': 850000, 'category': 'cash'},
        {'metric_name': 'Runway', 'value': 17, 'category': 'cash'},
        
        # Customer Metrics
        {'metric_name': 'CAC', 'value': 450, 'category': 'customers'},
        {'metric_name': 'LTV:CAC Ratio', 'value': 5.3, 'category': 'customers'},
        {'metric_name': 'Churn Rate', 'value': 2.5, 'category': 'customers'},
    ]

    print(f"Adding {len(metrics_data)} metrics...")
    # Add metrics
    for metric in metrics_data:
        db.session.add(FinancialMetrics(**metric))

    # Detailed transaction categories
    income_categories = {
        'Subscription Revenue': ['Enterprise Plan', 'Pro Plan', 'Basic Plan', 'Annual Subscription'],
        'Services': ['Consulting', 'Implementation', 'Training', 'Support'],
        'Other Income': ['Interest Income', 'Refund', 'Miscellaneous']
    }

    expense_categories = {
        'Salaries & Benefits': ['Engineering Salaries', 'Sales Salaries', 'Marketing Salaries', 'Health Insurance', '401k Match'],
        'Office & Operations': ['Office Rent', 'Utilities', 'Internet', 'Office Supplies', 'Cleaning Services'],
        'Technology': ['AWS Hosting', 'Software Licenses', 'Hardware', 'Cloud Services', 'Domain Names'],
        'Marketing': ['Google Ads', 'LinkedIn Ads', 'Content Marketing', 'SEO Tools', 'Social Media Ads'],
        'Travel & Entertainment': ['Flight Tickets', 'Hotel Stays', 'Meals & Entertainment', 'Uber/Lyft', 'Conference Tickets'],
        'Professional Services': ['Legal Fees', 'Accounting', 'Consulting', 'Recruiting'],
        'Food & Beverage': ['Team Lunch', 'Coffee & Snacks', 'Doordash', 'Catering'],
        'Other': ['Bank Fees', 'Insurance', 'Miscellaneous']
    }

    # Generate sample transactions for the last 30 days
    base_date = datetime.utcnow()
    transactions = []

    # Add income transactions
    for i in range(15):  # 15 income transactions
        days_ago = random.randint(0, 30)
        date = base_date - timedelta(days=days_ago)
        
        category = random.choice(list(income_categories.keys()))
        subcategory = random.choice(income_categories[category])
        
        if 'Subscription' in subcategory:
            amount = random.uniform(1000, 5000)
        elif 'Services' in category:
            amount = random.uniform(2000, 10000)
        else:
            amount = random.uniform(100, 1000)

        transactions.append(Transaction(
            type='income',
            amount=round(amount, 2),
            category=f"{category}: {subcategory}",
            description=f"{subcategory} - {date.strftime('%B %d')}",
            date=date
        ))

    # Add expense transactions
    for i in range(25):  # 25 expense transactions
        days_ago = random.randint(0, 30)
        date = base_date - timedelta(days=days_ago)
        
        category = random.choice(list(expense_categories.keys()))
        subcategory = random.choice(expense_categories[category])
        
        if 'Salaries' in category:
            amount = random.uniform(5000, 15000)
        elif 'Office' in category or 'Technology' in category:
            amount = random.uniform(1000, 5000)
        elif 'Travel' in category:
            amount = random.uniform(200, 2000)
        elif 'Food' in category:
            amount = random.uniform(50, 500)
        else:
            amount = random.uniform(100, 1000)

        transactions.append(Transaction(
            type='expense',
            amount=round(amount, 2),
            category=f"{category}: {subcategory}",
            description=f"{subcategory} - {date.strftime('%B %d')}",
            date=date
        ))

    print(f"Adding {len(transactions)} transactions...")
    for transaction in transactions:
        db.session.add(transaction)

    try:
        db.session.commit()
        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.session.rollback()
        raise

def get_current_metrics():
    """Get the current financial metrics from the database."""
    metrics = FinancialMetrics.query.all()
    return {
        'mrr': next((m.value for m in metrics if m.metric_name == 'MRR'), 0),
        'arr': next((m.value for m in metrics if m.metric_name == 'ARR'), 0),
        'cac': next((m.value for m in metrics if m.metric_name == 'CAC'), 0),
        'ltv': next((m.value for m in metrics if m.metric_name == 'LTV'), 0),
        'ltv_to_cac_ratio': next((m.value for m in metrics if m.metric_name == 'LTV:CAC Ratio'), 0),
        'churn_rate': next((m.value for m in metrics if m.metric_name == 'Churn Rate'), 0),
        'revenue_growth_rate': next((m.value for m in metrics if m.metric_name == 'Revenue Growth'), 0),
        'gross_margin': next((m.value for m in metrics if m.metric_name == 'Gross Margin'), 0),
        'operating_expenses': next((m.value for m in metrics if m.metric_name == 'Operating Expenses'), 0),
        'net_income': next((m.value for m in metrics if m.metric_name == 'Net Income'), 0),
        'cash_burn_rate': next((m.value for m in metrics if m.metric_name == 'Net Burn'), 0),
        'runway': next((m.value for m in metrics if m.metric_name == 'Runway'), 0)
    }

def get_recent_transactions():
    """Get recent transactions from the database."""
    transactions = Transaction.query.order_by(Transaction.date.desc()).limit(20).all()
    return [{
        'description': f"{t.type}: {t.category}",
        'amount': t.amount,
        'date': t.date.strftime('%Y-%m-%d')
    } for t in transactions]

# Routes
@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    metrics = FinancialMetrics.query.all()
    return jsonify([{
        'id': m.id,
        'metric_name': m.metric_name,
        'value': m.value,
        'category': m.category,
        'timestamp': m.timestamp.isoformat()
    } for m in metrics])

@app.route('/api/metrics', methods=['POST'])
def add_metric():
    data = request.json
    new_metric = FinancialMetrics(
        metric_name=data['metric_name'],
        value=data['value'],
        category=data['category']
    )
    db.session.add(new_metric)
    db.session.commit()
    return jsonify({'message': 'Metric added successfully'}), 201

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.order_by(Transaction.date.desc()).all()
    return jsonify([{
        'id': t.id,
        'type': t.type,
        'amount': t.amount,
        'category': t.category,
        'description': t.description,
        'date': t.date.isoformat()
    } for t in transactions])

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    new_transaction = Transaction(
        type=data['type'],
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', '')
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction added successfully'}), 201

@app.route('/api/ask', methods=['POST'])
def ask_question():
    try:
        data = request.get_json()
        question = data.get('question')
        
        if not question:
            return jsonify({'error': 'No question provided'}), 400
            
        # Get current metrics
        metrics = get_current_metrics()
        
        # Get recent transactions
        transactions = get_recent_transactions()
        
        # Format transactions for context
        transactions_text = "\n".join([
            f"- {t['description']}: ${t['amount']} ({t['date']})"
            for t in transactions
        ])
        
        # Create a detailed context with specific numbers
        context = f"""Current Financial Metrics:
- Monthly Recurring Revenue (MRR): ${metrics['mrr']:,.2f}
- Annual Recurring Revenue (ARR): ${metrics['arr']:,.2f}
- Customer Acquisition Cost (CAC): ${metrics['cac']:,.2f}
- Customer Lifetime Value (LTV): ${metrics['ltv']:,.2f}
- LTV to CAC Ratio: {metrics['ltv_to_cac_ratio']:.1f}
- Churn Rate: {metrics['churn_rate']}%
- Revenue Growth Rate: {metrics['revenue_growth_rate']}%
- Gross Margin: {metrics['gross_margin']}%
- Operating Expenses: ${metrics['operating_expenses']:,.2f}
- Net Income: ${metrics['net_income']:,.2f}
- Cash Burn Rate: ${metrics['cash_burn_rate']:,.2f}
- Runway: {metrics['runway']} months

Recent Transactions:
{transactions_text}"""

        # Make request to Ollama API with enhanced prompt
        response = requests.post(
            OLLAMA_API_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": f"""You are a friendly and conversational financial advisor helping a startup founder understand their business metrics and make better decisions. 
Reference specific numbers from the metrics when answering questions if they are needed - this helps build trust and makes your advice more concrete.

Here's the current financial data:
{context}

When answering questions:
1. Be conversational and friendly, like you're having a coffee chat
2. Cite specific numbers from the metrics when necessary and relevant
3. Explain what these numbers mean in simple terms
4. Provide actionable insights based on the numbers
5. If you're making a recommendation, back it up with specific metrics
6. Sound like a real person, not a robot. Also be concise when possible.

Question: {question}

Answer:""",
                "stream": False
            }
        )
        
        if response.status_code == 200:
            return jsonify({'answer': response.json()['response']})
        else:
            return jsonify({'error': 'Failed to get response from Ollama'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Creating database tables...")
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
        seed_database()  # Add sample data
    app.run(debug=True, port=5001) 