# Sklep internetowy (Node.js/Express/MongoDB)

## Opis projektu

Jest to aplikacja sklepu internetowego zbudowana w oparciu o **Node.js**, framework **Express** oraz bazę danych **MongoDB** (zapewne z użyciem biblioteki **Mongoose**). Aplikacja umożliwia przeglądanie produktów, dodawanie ich do koszyka, składanie zamówień oraz obsługę panelu administracyjnego do zarządzania produktami.

---

## Spis treści

- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Użycie](#użycie)
- [Struktura projektu](#struktura-projektu)

---

## Wymagania

Do uruchomienia projektu potrzebujesz:

* **Node.js** (wersja 18+ zalecana)
* **MongoDB** (lokalnie lub zdalnie, np. MongoDB Atlas)

---

## Instalacja

Poniższe instrukcje pomogą Ci skonfigurować i uruchomić projekt lokalnie.

1.  **Sklonuj repozytorium (jeśli jest hostowane):**
    ```bash
    git clone [ADRES_URL_REPOZYTORIUM]
    cd nazwa-projektu
    ```

2.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```

3.  **Konfiguracja zmiennych środowiskowych:**
    Utwórz plik `.env` w katalogu głównym projektu i dodaj niezbędne zmienne, w tym ścieżkę do bazy danych:

    ```
    MONGODB_URI=[TWÓJ_LINK_DO_BAZY_DANYCH_MONGODB]
    SESSION_SECRET=bardzo-bezpieczny-sekret
    # Inne zmienne, np. dla Stripe, emaila, itp.
    ```

---

## Użycie

Aby uruchomić aplikację w trybie deweloperskim, użyj komendy:

```bash
npm start
# lub jeśli używasz narzędzia takiego jak nodemon:
npm run dev