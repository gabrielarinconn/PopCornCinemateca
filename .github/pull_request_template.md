## Qué cambia y por qué

<!-- Una o dos frases. Si no se puede explicar en una frase, la PR es demasiado grande. -->

## Checklist antes de pedir revisión

- [ ] `bash scripts/verify.sh --full` en verde en local
- [ ] Sin `any` sin justificar, sin supresiones mudas del compilador o del linter
- [ ] El dominio sigue sin importar React, Axios ni la caché
- [ ] Toda respuesta de red / almacenamiento local / URL nueva está validada, no afirmada por tipo
- [ ] Pruebas nuevas o actualizadas; cobertura 100% en `domain/`, 80% global
- [ ] Sin `--no-verify` en el historial de esta rama
- [ ] Atribución a TMDB intacta, si esta PR toca el pie de página

## Cómo se probó

<!-- Pasos manuales, capturas o vídeo si toca UI. -->

## Notas para quien revisa

<!-- Zonas dudosas, alternativas descartadas, algo que quieras que se mire con lupa. -->
