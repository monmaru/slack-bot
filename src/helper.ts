export async function asyncForEach<T>(array: T[], callback: (elem: T, index: Number, elems: T[]) => Promise<void>) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export async function errorHandleAsync(asyncAction: () => Promise<void>) {
  try {
    await asyncAction();
  } catch (err) {
    console.log(err);
  } finally {
    const heapUsed = process.memoryUsage().heapUsed;
    console.log(`Program is using ${heapUsed} bytes of Heap.`);
  }
}
