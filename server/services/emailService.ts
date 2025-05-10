// This is a mock email service
// In a production environment, this would be connected to a real email service like Nodemailer, SendGrid, etc.

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    try {
        // Log email details for development purposes
        console.log('📧 Email sent with the following details:');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html.substring(0, 100) + '...');
        
        // Simulate a successful send
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};