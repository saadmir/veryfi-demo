# VeryFi Demo App

A demo application to exercise use of VeryFi APIs.

- On startup, load existing documents (invoices and receipts)
- Upload and process a new file or select an already processed existing document
- Display extracted data. All properties found in the document, even the empty/null values are displayed.
- Correct any extracted data value by changing property names or valued.  All property names and values are editable.

```
git clone https://github.com/saadmir/veryfi-demo.git
cd veryfi-demo

npm install

VITE_CLIENT_ID=<client id> VITE_AUTHORIZATION=<authorication key> npm run dev
```
client id and authorization key can also be passed via `.env` file.
