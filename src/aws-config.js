import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: "ap-south-1_rSQy5aEEG",
            userPoolClientId: "2btqgu7gu596ovtdh9lea6rfs1",
            region: "ap-south-1",
        },
    },
});