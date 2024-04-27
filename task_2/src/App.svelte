<script lang="ts">
   // import type { Data, Rates } from "./types/types";

   let rates: any;

   let first_code: string = "";
   let first_base_value: number;
   let first_change_value: number;
   let second_code: string = "";
   let second_base_value: number;
   let second_change_value: number;
   let const_at_change: number;

   // Асинхронная функция для получания данных из сервера
   const getDate = async () => {
      const res = await fetch("http://localhost:3000/data");
      const json = await res.json();

      rates = new Map(Object.entries(json.rates));
      first_base_value = rates.get(first_code || json.base_code);
      first_change_value = first_base_value;
      const_at_change = first_change_value;

      second_base_value = rates.get(second_code || "RUB");
      second_change_value = second_base_value;

      return json;
   };

   const data = getDate();

   // Функция для переключении первой волюты
   const firstSwitcher = (
      event: Event & {
         currentTarget: EventTarget & HTMLSelectElement;
      }
   ) => {
      //
      first_code = event.currentTarget.value;
      rates && (first_base_value = rates.get(first_code));
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
      rates && (second_base_value = rates.get(second_code));
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
</script>

<main>
   <!-- Отображаем загрузку пока ждём ответа на запрос получения
      данных от сервера -->
   {#await data}
      <p>loading...</p>
   <!-- Если успешно получили даных то отображаем -->
   {:then data}
      <div>
         <input
            type="number"
            value={Number.isInteger(const_at_change || first_change_value)
               ? const_at_change || first_change_value
               : +const_at_change.toFixed(2) || +first_change_value.toFixed(2)}
            on:input={handleInputFirst}
         />
         <select on:change={firstSwitcher} value={first_code || data.base_code}>
            {#each rates as [key, value]}
               <option value={key}>{key}</option>
            {/each}
         </select>
      </div>

      <div>
         <input
            type="number"
            value={Number.isInteger(second_change_value)
               ? second_change_value
               : +second_change_value.toFixed(2)}
            on:input={handleInputSecond}
         />
         <select on:change={secondSwitcher} value={second_code || "RUB"}>
            {#each rates as [key, value]}
               <option value={key}>{key}</option>
            {/each}
         </select>
      </div>
   <!-- Если произошла ошибка при получения данных, то отображаем 
      сообщения об ошибке -->
   {:catch error}
      <p>{error.message}</p>
   {/await}
</main>

<style>
</style>
