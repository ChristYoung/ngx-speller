const fs = require('fs');
const dotEnv = require('dotenv');

dotEnv.config();

const isProduction = process.env.NODE_ENV === 'production';

const targetFilePath = isProduction ? '../src/environments/environment.ts' : '../src/environments/environment.development.ts';

const envConfigFile = `
export const environment = {
  production: ${isProduction},
  assemblyAiVoiceKey: '${process.env.ASSEMBLY_AI_VOICE_KEY}',
};
`;

fs.writeFile(targetFilePath, envConfigFile, (err) => {
    if (err) {
        console.error('Error writing environment file', err);
    } else {
        console.log('Environment file created successfully');
    }
});
