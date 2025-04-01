import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';
 
async function main() {
    console.log(colors.bold.green(`Welcome!`));
    console.log(colors.bold.green(`Start!`));

    while(true) {
        const userInput = readlineSync.question(colors.yellow(`You: `));

        try {
            const response = await openai.chat.completions.create({
                messages: [{ role: "user", content: "Hi" }],
                model: "deepseek-chat",
            });
            const completionText = response.data.choices[0].message.content;
            if(userInput.toLowerCase() === 'exit') {
                console.log(colors.green('Bot: BaiBai'));
                return;
            }
            console.log(colors.green('Bot: ') + completionText);
        } catch (e) {
            console.error(colors.red(e));
        }
    }
}


main();
