<script lang="ts">
   import type { Data } from "./types/types";

   let rates: Map<string, number>;

   let first_code: string = "USD";
   let first_base_value: number;
   let first_change_value: number;
   let second_code: string = "RUB";
   let second_base_value: number;
   let second_change_value: number;
   let const_at_change: number;
   let time_last_update_utc: string;

   // Асинхронная функция для получания данных из сервера
   const getDate = async (): Promise<Data> => {
      const response: Response = await fetch(import.meta.env.VITE_API_URL);

      if (!response.ok) throw new Error(response.statusText);

      const data: Data = await response.json();      
      time_last_update_utc = new Date(data.time_last_update_utc).toUTCString();

      rates = new Map(Object.entries(data.rates));
      first_base_value = rates.get(first_code || data.base_code)!;
      first_change_value = first_base_value;
      const_at_change = first_change_value;

      second_base_value = rates.get(second_code || "RUB")!;
      second_change_value = second_base_value;

      return data;
   };

   const awaitData: Promise<Data> = getDate();

   // Функция для переключении первой волюты
   const firstSwitcher = (
      event: Event & {
         currentTarget: EventTarget & HTMLSelectElement;
      }
   ) => {
      first_code = event.currentTarget.value;

      rates && (first_base_value = rates.get(first_code) as number);
      second_change_value =
         (const_at_change * second_base_value) / first_base_value;
   };
   // Функция для изменения значения первой волюты
   const handleInputFirst = (
      event: Event & {
         currentTarget: EventTarget & HTMLInputElement;
      }
   ) => {
      const_at_change = +event.currentTarget.value;
      second_change_value =
         (+event.currentTarget.value * second_base_value) / first_base_value;
      first_change_value = +event.currentTarget.value;
   };

   // Функция для переключении второй волюты
   const secondSwitcher = (
      event: Event & {
         currentTarget: EventTarget & HTMLSelectElement;
      }
   ) => {
      second_code = event.currentTarget.value;
      rates && (second_base_value = rates.get(second_code) as number);
      second_change_value =
         (const_at_change * second_base_value) / first_base_value;
   };
   // Функция для изменения значения второй волюты
   const handleInputSecond = (
      event: Event & {
         currentTarget: EventTarget & HTMLInputElement;
      }
   ) => {
      first_change_value =
         (+event.currentTarget.value * first_base_value) / second_base_value;
      const_at_change = first_change_value;
      second_change_value = +event.currentTarget.value;
   };

   // Функция для замены полей валют
   const replaceCurrencies = () => {
      [first_code, second_code] = [second_code, first_code];
      [first_base_value, second_base_value] = [
         second_base_value,
         first_base_value,
      ];
      second_change_value =
         (const_at_change * second_base_value) / first_base_value;
   };
</script>

<main>
   <!-- Отображаем загрузку пока ждём ответа на запрос получения
      данных от сервера -->
   {#await awaitData}
      <div class="loading-container">
         <p>loading...</p>
      </div>
      <!-- Если успешно получили даных то отображаем -->
   {:then data}
      <h2>Конвертер валют</h2>
      <section class="currency-panel">
         <!-- Контейнер первой волюты -->
         <div class="converter-input-container">
            <input
               type="number"
               value={Number.isInteger(const_at_change || first_change_value)
                  ? const_at_change || first_change_value
                  : +const_at_change.toFixed(2) ||
                    +first_change_value.toFixed(2)}
               on:input={handleInputFirst}
            />
            <select
               on:change={firstSwitcher}
               value={first_code || data.base_code}
            >
               {#each rates as [key, value]}
                  <option value={key}>{key}</option>
               {/each}
            </select>
         </div>

         <!-- Кнопка для замены -->
         <button class="replace-btn" on:click={replaceCurrencies}>
            <svg
               class="arrow-icon"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               width="20"
               height="20"
               fill="currentColor"
               ><path
                  d="M6 4H21C21.5523 4 22 4.44772 22 5V12H20V6H6V9L1 5L6 1V4ZM18 20H3C2.44772 20 2 19.5523 2 19V12H4V18H18V15L23 19L18 23V20Z"
               ></path></svg
            >
         </button>

         <!-- Контейнер второй волюты -->
         <div class="converter-input-container">
            <input
               type="number"
               value={first_change_value > -1
                  ? Number.isInteger(second_change_value)
                     ? second_change_value
                     : +second_change_value.toFixed(2)
                  : ""}
               on:input={handleInputSecond}
            />
            <select on:change={secondSwitcher} value={second_code || "RUB"}>
               {#each rates as [key, value]}
                  <option value={key}>{key}</option>
               {/each}
            </select>
         </div>
      </section>
      <p class="time-last-update">Данные за {time_last_update_utc}</p>

      <!-- Если произошла ошибка при получения данных, то отображаем 
      сообщения об ошибке -->
   {:catch error}
      <p>{error.message}</p>
   {/await}
</main>

<style>
   /* Убираем стрелки/спиннеры полей */
   /* Chrome, Safari, Edge, Opera */
   input::-webkit-outer-spin-button,
   input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
   }
   input,
   select {
      outline: none;
      padding-left: 15px;
      font-size: 16px;
   }
   input {
      height: 40px;
   }
   select {
      display: inline-block;
      line-height: 1.5em;
      padding-left: 15px;
      padding-right: 30px;
      border-left: 1px solid;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: linear-gradient(45deg, transparent 50%, gray 50%),
         linear-gradient(135deg, gray 50%, transparent 50%);
      background-position:
         calc(100% - 20px) calc(1em + 2px),
         calc(100% - 15px) calc(1em + 2px),
         calc(100% - 2.5em) 0.5em;
      background-size:
         5px 5px,
         5px 5px,
         1px 1.5em;
      background-repeat: no-repeat;
   }
   .converter-input-container:focus-within select {
      border-left: 1px solid #08a652;
      background-image: linear-gradient(45deg, transparent 50%, #08a652 50%),
         linear-gradient(135deg, #08a652 50%, transparent 50%);
   }

   .currency-panel {
      display: grid;
      grid-template-columns: 1fr auto;
      padding: 40px 20px 20px;
      gap: 15px;
   }
   .converter-input-container {
      display: flex;
      outline: 1px solid rgba(255, 255, 255, 0.87);
      border-radius: 3px;
      transition: 0.2s;
   }

   .converter-input-container:focus-within {
      outline: 1px solid #08a652;
   }

   .replace-btn {
      outline: 1px solid rgba(255, 255, 255, 0.87);
      border-radius: 3px;
      padding: 0 15px;
      grid-column-start: 2;
      grid-row: 1/3;
      transition: 0.2s;
   }
   .replace-btn:hover {
      outline: 1px solid #08a652;
      background-color: #08a65210;
   }
   .replace-btn:hover .arrow-icon {
      color: #08a652;
   }
   .time-last-update {
      text-align: center;
      font-size: 13px;
   }
   @media (min-width: 760px) {
      .currency-panel {
         grid-template-columns: 1fr auto 1fr;
      }
      .replace-btn {
         grid-row-end: 2;
         outline: none;
         padding: 0;
      }
      .replace-btn:hover {
         outline: none;
         background-color: transparent;
      }
      input,
      select {
         font-size: 22px;
         background-position:
         calc(100% - 20px) calc(0.8em + 2px),
         calc(100% - 16px) calc(0.8em + 2px),
         calc(100% - 2.5em) 0.5em;
      }
      .time-last-update {
         font-size: 16px;
      }
   }
   
   .loading-container {
      background-color: #08a65221;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100vh;
      font-size: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
   }
</style>
