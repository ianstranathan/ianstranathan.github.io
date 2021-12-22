function nn(arr)
{
    let len = ll(arr);
    for(let i = 0; i < arr.length; i++)
    {
        arr[i] /= len;
    }
	return arr;
}

function ll(arr)
{
	let sumOfSquares = 0;
    for(let i = 0; i < arr.length; i++)
    {
        sumOfSquares += arr[i] * arr[i];
    }
	return Math.sqrt(sumOfSquares);
}

function ss(arr, s)
{
    for(let i = 0; i < arr.length; i++)
    {
        arr[i] *= s;
    }
	return arr;
}