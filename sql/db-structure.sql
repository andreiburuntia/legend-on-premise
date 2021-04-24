CREATE TABLE `hrs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `bag_id` varchar(5) DEFAULT NULL,
  `workout_id` int(11) unsigned DEFAULT NULL,
  `hr` smallint(6) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;


CREATE TABLE `hrs_storage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `bag_id` varchar(5) DEFAULT NULL,
  `workout_id` int(11) unsigned DEFAULT NULL,
  `hr` smallint(6) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;


CREATE TABLE `punches` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `bag_id` varchar(5) DEFAULT NULL,
  `workout_id` int(11) unsigned DEFAULT NULL,
  `score` varchar(5) DEFAULT NULL,
  `count` varchar(5) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;


CREATE TABLE `punches_storage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `bag_id` varchar(5) DEFAULT NULL,
  `workout_id` int(11) unsigned DEFAULT NULL,
  `score` varchar(5) DEFAULT NULL,
  `count` varchar(5) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;