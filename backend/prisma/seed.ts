import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  const hashedPassword = await argon2.hash('Demo123456!');
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@edunotifysim.com' },
    update: {},
    create: {
      email: 'demo@edunotifysim.com',
      password: hashedPassword,
      name: 'Demo User',
      emailVerified: true,
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Sample template 1: Crypto Education Deposit
  const cryptoTemplate = await prisma.emailTemplate.upsert({
    where: { id: 'crypto-edu-deposit-1' },
    update: {},
    create: {
      id: 'crypto-edu-deposit-1',
      userId: user.id,
      name: 'Crypto Education - Deposit Simulation',
      description: 'Educational simulation of a cryptocurrency deposit notification',
      category: 'CRYPTO_EDUCATION',
      subject: 'Crypto Deposit Received - {{amount}} {{currency}}',
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crypto Deposit</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🪙 Crypto Deposit Received</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p>Hello {{name}},</p>
    
    <p>This is an educational simulation of a cryptocurrency deposit notification.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <h2 style="margin-top: 0; color: #10b981;">Deposit Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
          <td style="padding: 8px 0; text-align: right;">{{amount}} {{currency}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Date:</td>
          <td style="padding: 8px 0; text-align: right;">{{date}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Transaction ID:</td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">{{reference_id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Network:</td>
          <td style="padding: 8px 0; text-align: right;">{{network}}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; color: #92400e;"><strong>⚠️ Educational Note:</strong> This is a learning simulation. Real crypto transactions involve actual blockchain confirmations and wallet addresses.</p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      If you have questions about this educational simulation, please contact support.
    </p>
  </div>
</body>
</html>
      `,
      textBody: 'Crypto Deposit: {{amount}} {{currency}} on {{date}}. Transaction: {{reference_id}}',
      variables: ['name', 'amount', 'currency', 'date', 'reference_id', 'network'],
      isPublic: true,
    },
  });

  // Sample template 2: E-commerce Order
  const ecommerceTemplate = await prisma.emailTemplate.upsert({
    where: { id: 'ecommerce-order-1' },
    update: {},
    create: {
      id: 'ecommerce-order-1',
      userId: user.id,
      name: 'E-commerce - Order Confirmation Simulation',
      description: 'Educational simulation of an online order confirmation',
      category: 'ECOMMERCE',
      subject: 'Order Confirmation #{{order_number}} - {{item_name}}',
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2563eb; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📦 Order Confirmed</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p>Dear {{name}},</p>
    
    <p>Thank you for your order! This is an educational simulation of an e-commerce order confirmation.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #2563eb;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Order Number:</td>
          <td style="padding: 8px 0; text-align: right;">#{{order_number}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Item:</td>
          <td style="padding: 8px 0; text-align: right;">{{item_name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Quantity:</td>
          <td style="padding: 8px 0; text-align: right;">{{quantity}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Total Amount:</td>
          <td style="padding: 8px 0; text-align: right; font-size: 18px; color: #10b981; font-weight: bold;">{{amount}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Order Date:</td>
          <td style="padding: 8px 0; text-align: right;">{{date}}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-top: 2px solid #2563eb;">
      <h3 style="margin-top: 0; color: #1e40af;">Shipping Information</h3>
      <p style="margin: 5px 0;">Estimated Delivery: {{delivery_date}}</p>
      <p style="margin: 5px 0;">Tracking Number: {{reference_id}}</p>
    </div>
    
    <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
      <p style="margin: 0; color: #1e40af;"><strong>📚 Educational Simulation:</strong> This is a simulated e-commerce order. No real transaction or shipping has occurred.</p>
    </div>
  </div>
</body>
</html>
      `,
      textBody: 'Order #{{order_number}} confirmed. Item: {{item_name}}, Amount: {{amount}}, Date: {{date}}',
      variables: ['name', 'order_number', 'item_name', 'quantity', 'amount', 'date', 'delivery_date', 'reference_id'],
      isPublic: true,
    },
  });

  // Sample template 3: Banking Transaction Alert
  const bankingTemplate = await prisma.emailTemplate.upsert({
    where: { id: 'banking-alert-1' },
    update: {},
    create: {
      id: 'banking-alert-1',
      userId: user.id,
      name: 'Banking - Transaction Alert Simulation',
      description: 'Educational simulation of a bank transaction notification',
      category: 'BANKING',
      subject: 'Transaction Alert - {{amount}} {{transaction_type}}',
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaction Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #059669; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🏦 Transaction Alert</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p>Hello {{name}},</p>
    
    <p>This is an educational simulation of a banking transaction alert.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
      <h2 style="margin-top: 0; color: #059669;">Transaction Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Type:</td>
          <td style="padding: 8px 0; text-align: right;">{{transaction_type}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
          <td style="padding: 8px 0; text-align: right; font-size: 20px; color: #059669; font-weight: bold;">{{amount}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Date & Time:</td>
          <td style="padding: 8px 0; text-align: right;">{{date}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Reference:</td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace;">{{reference_id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Account:</td>
          <td style="padding: 8px 0; text-align: right;">****{{account_last_four}}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <p style="margin: 0; color: #991b1b;"><strong>⚠️ Security Note:</strong> In a real banking system, never share your full account number or personal banking details via email.</p>
    </div>
    
    <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #065f46;"><strong>📚 Educational Purpose:</strong> This is a simulated banking alert. No real financial transaction has occurred.</p>
    </div>
  </div>
</body>
</html>
      `,
      textBody: 'Transaction Alert: {{transaction_type}} of {{amount}} on {{date}}. Reference: {{reference_id}}',
      variables: ['name', 'transaction_type', 'amount', 'date', 'reference_id', 'account_last_four'],
      isPublic: true,
    },
  });

  // Sample template 4: Logistics Shipment Update
  const logisticsTemplate = await prisma.emailTemplate.upsert({
    where: { id: 'logistics-shipment-1' },
    update: {},
    create: {
      id: 'logistics-shipment-1',
      userId: user.id,
      name: 'Logistics - Shipment Update Simulation',
      description: 'Educational simulation of a package tracking notification',
      category: 'LOGISTICS',
      subject: 'Package Update: {{status}} - Tracking #{{tracking_number}}',
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipment Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #7c3aed; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📮 Shipment Update</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p>Dear {{name}},</p>
    
    <p>Your package has a new status update! This is an educational simulation of a logistics tracking notification.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #7c3aed;">
      <h2 style="color: #7c3aed; margin: 10px 0; font-size: 22px;">{{status}}</h2>
      <p style="color: #6b7280; margin: 5px 0;">as of {{date}}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #5b21b6;">Shipment Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Tracking Number:</td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace;">{{tracking_number}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Carrier:</td>
          <td style="padding: 8px 0; text-align: right;">{{carrier}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Origin:</td>
          <td style="padding: 8px 0; text-align: right;">{{origin}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Destination:</td>
          <td style="padding: 8px 0; text-align: right;">{{destination}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Est. Delivery:</td>
          <td style="padding: 8px 0; text-align: right; color: #10b981; font-weight: bold;">{{estimated_delivery}}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #f3e8ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
      <p style="margin: 0; color: #5b21b6;"><strong>📦 Educational Simulation:</strong> This is a simulated shipment tracking notification. No real package is in transit.</p>
    </div>
  </div>
</body>
</html>
      `,
      textBody: 'Shipment {{status}}. Tracking: {{tracking_number}}, Carrier: {{carrier}}, Est. Delivery: {{estimated_delivery}}',
      variables: ['name', 'status', 'date', 'tracking_number', 'carrier', 'origin', 'destination', 'estimated_delivery'],
      isPublic: true,
    },
  });

  console.log('✅ Created sample templates:');
  console.log('  - Crypto Education Deposit');
  console.log('  - E-commerce Order Confirmation');
  console.log('  - Banking Transaction Alert');
  console.log('  - Logistics Shipment Update');

  console.log('\n🎉 Database seeding completed!');
  console.log('\n📧 Demo User Credentials:');
  console.log('  Email: demo@edunotifysim.com');
  console.log('  Password: Demo123456!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
