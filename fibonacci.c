#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
unsigned long long fibonacci(int n)
{
    if (n <= 1)
        return n;

    unsigned long long prev = 0;
    unsigned long long current = 1;

    for (int i = 2; i <= n; i++)
    {
        unsigned long long next = prev + current;
        prev = current;
        current = next;
    }

    return current;
}