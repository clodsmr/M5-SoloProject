import express from "express"
import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const mediaRouter = express.Router()

const { readJSON, writeJSON, writeFile } = fs


const currentFilePath = fileURLToPath(import.meta.url)


const folderPath = dirname(currentFilePath)


const mediaJSONPath = join(folderPath, "media.json")
console.log(mediaJSONPath)

const getMedia = () => readJSON(mediaJSONPath)
const writeMedia = content =>   writeJSON(mediaJSONPath, content)


mediaRouter.post("/", async (req, res)=> {
      try {
          const media = await getMedia()
          const newMedia = {...req.body, createdAt: new Date(), updatedAt: new Date(), imdbID: uniqid()}
          media.push(newMedia)

          await writeMedia(media)

          res.send({newMedia})

      }catch(error) {
        res.send({message: error.message})
      }

})

mediaRouter.get("/", async (req, res)=> {
    try {

        const media = await getMedia()
        res.send({media})

    }catch(error) {
        res.send({message: error.message})
    }
})

mediaRouter.get("/:id", async (req, res, next) => {
    try {
      const media = await getMedia()
  
      const movie = media.find(m=> m.imdbID === req.params.id);
      if (!movie) {
        res.send({ message: `blog with ${req.params.id} is not found!` });
      }
      res.send(movie);
    } catch (error) {
      res.send({ message: error.message });
    }
  })

mediaRouter.delete("/:id", async (req, res, next) => {
    try {
      let media = await getMedia()
  
      const movie = media.find(m=> m.imdbID === req.params.id);
      if (!movie) {
        res
       
          .send({ message: `post with ${req.params.id} is not found!` });
      }
      media = media.filter(
        (m) => m.imdbID!== req.params.id
      );
      await writeMedia(media)
      res.send(media);
    } catch (error) {
      res.send({ message: error.message });
    }
  });

  mediaRouter.put("/:id", async(req, res, next)=> {

    try {
        const media = await getMedia()
        const index = media.findIndex(movie => m.imdbID === req.params.id)
        if (!index == -1) {
            res
              
              .send({ message: `movie with ${req.params.id} is not found!` });
          }

          const movie = media[index]

          const updatedMovie= {
              ...movie, ...req.body, updatedAt: new Date ()
          }

          movie[index] = updatedMovie
          await writeMedia(media)
          res.send(updatedMovie)

    }catch(error) {
        res.send({message: error.message})
    }
  })


export default mediaRouter