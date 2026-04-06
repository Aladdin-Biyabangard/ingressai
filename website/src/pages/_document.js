import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="preload" as="image" href="/images/home-bg.svg" />
          <link rel="preload" as="image" href="/icons/stay-updated-bg.svg" />
          <link rel="preload" as="image" href="/images/why-choose-us.png" />
          <link rel="preload" as="image" href="/images/comments-bg.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
