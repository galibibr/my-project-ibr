<script lang="ts">
   const myDate = async () => {
      const res = await fetch("http://localhost:3000/data");
      const json = await res.json();

      return json;
   };
   const myDate2 = myDate();

</script>

<main>
   {#await myDate2}
      <p>loading...</p>
   {:then data}
      <p>{data.result}</p>
   {/await}
</main>

<style>
</style>
