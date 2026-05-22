# Guia de Comandos Git

## Configuracion inicial

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
git config --list
```

## Inicio y clonacion

```bash
git init                                    # Inicializa repositorio
git clone <url-repositorio>                 # Clona repositorio remoto
git clone <url> <nombre-carpeta>            # Clona en carpeta especifica
```

## Trabajo diario

```bash
git status                                  # Estado del working directory
git diff                                    # Cambios sin staging
git diff --staged                           # Cambios en staging
git add <archivo>                           # Anade archivo al staging
git add .                                   # Anade todos los cambios
git commit -m "mensaje"                     # Crea commit
git commit -am "mensaje"                    # Add + commit (solo archivos trackeados)
```

## Historial

```bash
git log                                     # Historial completo
git log --oneline                           # Historial resumido
git log --oneline --graph                   # Historial con grafo
git log --oneline --graph --all             # Todas las ramas
git log --author="nombre"                   # Filtra por autor
git log --since="2024-01-01"               # Filtra por fecha
git show <hash>                             # Muestra detalles de un commit
```

## Ramas

```bash
git branch                                  # Lista ramas
git branch <nombre-rama>                    # Crea rama
git checkout <nombre-rama>                  # Cambia a rama
git checkout -b <nombre-rama>               # Crea y cambia a rama
git switch <nombre-rama>                    # Cambia a rama (alternativa moderna)
git switch -c <nombre-rama>                 # Crea y cambia (moderno)
git merge <nombre-rama>                     # Fusiona rama en la actual
git merge --no-ff <nombre-rama>             # Fusiona sin fast-forward
git branch -d <nombre-rama>                 # Elimina rama (fusionada)
git branch -D <nombre-rama>                 # Elimina rama (forzado)
```

## Remotos

```bash
git remote -v                               # Lista repositorios remotos
git remote add origin <url>                 # Anade remoto
git push -u origin main                     # Sube rama y establece upstream
git push                                    # Sube cambios al remoto
git pull                                    # Descarga cambios del remoto
git fetch                                   # Descarga cambios sin fusionar
git remote remove <nombre>                  # Elimina remoto
```

## Stash

```bash
git stash                                   # Guarda cambios temporalmente
git stash list                              # Lista stashes
git stash pop                               # Recupera y elimina ultimo stash
git stash apply                             # Recupera sin eliminar
git stash drop                              # Elimina un stash
git stash clear                             # Elimina todos los stashes
```

## Rebase

```bash
git rebase main                             # Rebase de rama actual sobre main
git rebase -i HEAD~3                        # Rebase interactivo (ultimos 3 commits)
# squash: combina commits
# reword: cambia mensaje
# edit: modifica commit
# drop: elimina commit
```

## Tags

```bash
git tag                                     # Lista tags
git tag v1.0.0                              # Crea tag ligero
git tag -a v1.0.0 -m "Version 1.0.0"       # Crea tag anotado
git push origin v1.0.0                      # Sube tag al remoto
git push --tags                             # Sube todos los tags
git checkout v1.0.0                         # Cambia a tag
git tag -d v1.0.0                           # Elimina tag local
```

## Resolucion de conflictos

Cuando ocurre un conflicto durante un merge:

1.  Git marca el archivo con conflicto.
2.  Abre el archivo y busca las marcas:
    ```
    <<<<<<< HEAD
    contenido de la rama actual
    =======
    contenido de la rama que se fusiona
    >>>>>>> feature/nueva-funcion
    ```
3.  Edita el archivo para mantener el contenido deseado.
4.  Elimina las marcas `<<<<<<<`, `=======`, `>>>>>>>`.
5.  Guarda el archivo.
6.  Ejecuta:
    ```bash
    git add <archivo-resuelto>
    git commit
    ```

## Buenas practicas

1.  **Commits atomicos**: cada commit debe contener un unico cambio logico.
2.  **Mensajes claros**: usar imperativo, primera linea < 50 caracteres.
3.  **No commitear archivos generados**: usar `.gitignore`.
4.  **Pull antes de push**: `git pull --rebase` para evitar merges innecesarios.
5.  **Ramas por funcionalidad**: cada feature nueva en su propia rama.
6.  **Code review**: usar Pull Requests para revision de codigo.

## Ejemplo completo de flujo

```bash
# Inicializar proyecto
git init
git add README.md
git commit -m "chore: initial commit with README"

# Crear funcionalidad
git checkout -b feature/login-form
# ... trabajar en el codigo ...
git add src/login/
git commit -m "feat: add login form with validation"
git push -u origin feature/login-form

# Fusionar a main
git checkout main
git pull
git merge --no-ff feature/login-form
git push

# Publicar version
git tag -a v1.0.0 -m "Version 1.0.0 - Login implementado"
git push --tags
```
