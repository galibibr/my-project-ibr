<script lang="ts">
   import type { Data, Rates } from "./types/types";
   // type Currency = {};
   // type RatesArr = {};

   let rates: any;
   let first_code: string = "";
   let first_value: number;
   let second_code: string = "";
   let second_value: number;

   const myDate = async () => {
      const res = await fetch("http://localhost:3000/data");
      const json = await res.json();

      rates = new Map(Object.entries(json.rates));
      first_value = rates.get(first_code || json.base_code);
      console.log("first value =", first_value);

      second_value = rates.get(second_code || "RUB");
      console.log("second value =", second_value);

      return json;
   };

   const myDate2 = myDate();

   const firstSelect = (
      event: Event & {
         currentTarget: EventTarget & HTMLSelectElement;
      }
   ) => {
      first_code = event.currentTarget.value;
      rates && (first_value = rates.get(first_code));
   };

   const secondSelect = (
      event: Event & {
         currentTarget: EventTarget & HTMLSelectElement;
      }
   ) => {
      second_code = event.currentTarget.value;
      rates && (second_value = rates.get(second_code));
   };
</script>

<main>
   {#await myDate2}
      <p>loading...</p>
   {:then data}
      <div>
         <input type="text" bind:value={first_value} />
         <select on:change={firstSelect} value={first_code || data.base_code}>
            {#each rates as [key, value]}
               <option value={key}>{key}</option>
            {/each}
         </select>
      </div>

      <div>
         <input type="text" bind:value={second_value} />
         <select on:change={secondSelect} value={second_code || 'RUB'}>
            {#each rates as [key, value]}
               <option value={key}>{key}</option>
            {/each}
         </select>
      </div>
   {/await}
</main>

<style>
</style>
