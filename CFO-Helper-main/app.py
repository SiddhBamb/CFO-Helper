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
OLLAMA_API_URL = 'http://localhost:11434/api/generate'
MODEL_NAME = 'phi'  # Using phi model instead of llama2

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

    # Sample transactions (last 30 days)
    transaction_categories = {
        'income': [
            'Subscription Revenue',
            'Enterprise Contract',
            'Service Fee',
            'Consulting Income',
            'API Usage Revenue',
            'Training Revenue',
            'Support Contract',
            'License Renewal',
            'Custom Development',
            'Integration Fee'
        ],
        'expense': [
            'AWS Cloud Services',
            'Google Cloud Platform',
            'Microsoft Azure',
            'Slack Subscription',
            'Zoom Subscription',
            'GitHub Enterprise',
            'Jira Cloud',
            'Confluence Cloud',
            'Salesforce CRM',
            'HubSpot Marketing',
            'LinkedIn Ads',
            'Google Ads',
            'Facebook Ads',
            'Employee Salaries',
            'Contractor Payments',
            'Office Rent',
            'Utilities',
            'Internet Service',
            'Phone Service',
            'Travel Expenses',
            'Meals & Entertainment',
            'Equipment Purchase',
            'Software Licenses',
            'Professional Services',
            'Legal Fees',
            'Accounting Services',
            'Insurance Premiums',
            'Marketing Materials',
            'Conference Fees',
            'Training Programs'
        ]
    }

    # Generate some sample transactions
    for i in range(30):
        days_ago = 30 - i
        date = datetime.utcnow() - timedelta(days=days_ago)
        
        # Add 2-4 transactions per day
        for _ in range(random.randint(2, 4)):
            trans_type = random.choice(['income', 'expense'])
            category = random.choice(transaction_categories[trans_type])
            
            if trans_type == 'income':
                amount = random.uniform(1000, 5000)
                if category in ['Enterprise Contract', 'Custom Development']:
                    amount *= 5
                if category in ['API Usage Revenue', 'Training Revenue']:
                    amount *= 0.5
            else:
                amount = random.uniform(100, 3000)
                if category in ['Employee Salaries', 'Office Rent']:
                    amount *= 3
                if category in ['AWS Cloud Services', 'Google Cloud Platform', 'Microsoft Azure']:
                    amount *= 2
                if category in ['LinkedIn Ads', 'Google Ads', 'Facebook Ads']:
                    amount *= 0.5

            # Add specific descriptions based on category
            description = f"{category}"
            if category == 'AWS Cloud Services':
                description = f"AWS Cloud Services - EC2, S3, RDS ({date.strftime('%B %d')})"
            elif category == 'Employee Salaries':
                description = f"Employee Salaries - Payroll Run ({date.strftime('%B %d')})"
            elif category == 'Office Rent':
                description = f"Office Rent - {date.strftime('%B %Y')}"
            elif category == 'LinkedIn Ads':
                description = f"LinkedIn Ads - Lead Generation Campaign ({date.strftime('%B %d')})"
            elif category == 'Enterprise Contract':
                description = f"Enterprise Contract - {random.choice(['Acme Corp', 'Tech Solutions Inc', 'Global Industries'])}"
            elif category == 'Subscription Revenue':
                description = f"Subscription Revenue - {random.choice(['Monthly', 'Annual', 'Quarterly'])} Plan"

            db.session.add(Transaction(
                type=trans_type,
                amount=round(amount, 2),
                category=category,
                description=description,
                date=date
            ))

    try:
        db.session.commit()
        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.session.rollback()
        raise

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
    limit = request.args.get('limit', default=10, type=int)
    transactions = Transaction.query.order_by(Transaction.date.desc()).limit(limit).all()
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
    data = request.json
    question = data.get('question', '')

    # Get current metrics and transactions for context
    metrics = FinancialMetrics.query.all()
    transactions = Transaction.query.order_by(Transaction.date.desc()).limit(5).all()

    # Format context
    context = "Current Financial Metrics:\n"
    for metric in metrics:
        context += f"{metric.metric_name}: {metric.value}\n"
    
    context += "\nRecent Transactions:\n"
    for transaction in transactions:
        context += f"{transaction.type}: {transaction.amount} ({transaction.category}) - {transaction.description}\n"

    try:
        # Call Ollama API
        response = requests.post(
            OLLAMA_API_URL,
            json={
                "model": MODEL_NAME,
                "prompt": f"""You are a financial advisor helping a startup founder understand their business metrics and make better decisions.

Context:
{context}

Question: {question}

Please provide a detailed, helpful response that:
1. References specific metrics and trends
2. Offers actionable insights
3. Considers the business context
4. Uses clear, professional language""",
                "stream": False
            }
        )
        
        if response.status_code == 200:
            answer = response.json()['response']
            return jsonify({'answer': answer})
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